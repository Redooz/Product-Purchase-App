import { TransactionServicePort } from '@/transaction/domain/api/transaction.service.port';
import { Injectable } from '@nestjs/common';
import { OrderTransaction } from '@/transaction/domain/model/order.transaction';
import { ProductServicePort } from '@/product/domain/api/product.service.port';
import { Status } from '@/transaction/domain/model/enum/status';
import { Product } from '@/product/domain/model/product';
import { CustomerServicePort } from '@/customer/domain/api/customer.service.port';
import { TransactionPersistencePort } from '@/transaction/domain/spi/transaction.persistence.port';
import { ProductQuantityNotAvailableError } from '@/transaction/domain/exception/product.quantity.not.available.error';
import { TransactionStatusPersistencePort } from '@/transaction/domain/spi/transaction.status.persistence.port';
import { DeliveryServicePort } from '@/modules/delivery/domain/api/delivery.service.port';
import { Delivery } from '@/modules/delivery/domain/model/delivery';
import { AcceptanceServicePort } from '@/transaction/domain/spi/acceptance.service.port';
import { AcceptanceType } from '@/transaction/domain/model/enum/acceptance.type';
import { Card } from '@/transaction/domain/model/card';
import { TransactionNotFoundError } from '@/transaction/domain/exception/transaction.not.found.error';
import { PaymentGatewayServicePort } from '@/transaction/domain/spi/payment.gateway.service.port';
import { PaymentStatus } from '@/transaction/domain/model/enum/payment.status';
import { TransactionAlreadyFinishedError } from '@/transaction/domain/exception/transaction.already.finished.error';

@Injectable()
export class TransactionUsecase extends TransactionServicePort {
  constructor(
    private readonly productServicePort: ProductServicePort,
    private readonly customerServicePort: CustomerServicePort,
    private readonly deliveryServicePort: DeliveryServicePort,
    private readonly acceptanceServicePort: AcceptanceServicePort,
    private readonly paymentGatewayServicePort: PaymentGatewayServicePort,
    private readonly transactionPersistencePort: TransactionPersistencePort,
    private readonly transactionStatusPersistencePort: TransactionStatusPersistencePort,
  ) {
    super();
  }

  override async startTransaction(
    pendingTransaction: OrderTransaction,
  ): Promise<{ transaction: OrderTransaction; delivery: Delivery }> {
    const customer = await this.customerServicePort.getCustomerById(
      pendingTransaction.customer.id,
    );

    const product = await this.productServicePort.getProductById(
      pendingTransaction.product.id,
    );

    if (
      this.productQuantityIsNotAvailable(product, pendingTransaction.quantity)
    ) {
      throw new ProductQuantityNotAvailableError();
    }

    pendingTransaction.customer = customer;
    pendingTransaction.delivery.fee = this.calculateDeliveryFee();

    pendingTransaction.total =
      this.calculateSubTotal(product, pendingTransaction.quantity) +
      pendingTransaction.delivery.fee;

    pendingTransaction.status =
      await this.transactionStatusPersistencePort.getTransactionStatusByName(
        Status.PENDING,
      );

    pendingTransaction.delivery = await this.deliveryServicePort.createDelivery(
      pendingTransaction.delivery,
    );

    const presignedAcceptances =
      await this.acceptanceServicePort.getAllPresignedAcceptances();

    const acceptanceEndUserPolicy = presignedAcceptances.find(
      (acceptance) => acceptance.type === AcceptanceType.END_USER_POLICY,
    );

    const acceptancePersonalDataAuthorization = presignedAcceptances.find(
      (acceptance) =>
        acceptance.type === AcceptanceType.PERSONAL_DATA_AUTHORIZATION,
    );

    pendingTransaction.acceptanceEndUserPolicy = acceptanceEndUserPolicy;

    const transaction =
      await this.transactionPersistencePort.startTransaction(
        pendingTransaction,
      );

    transaction.acceptancePersonalDataAuthorization =
      acceptancePersonalDataAuthorization;
    transaction.acceptanceEndUserPolicy.permalink =
      acceptanceEndUserPolicy.permalink;

    return {
      transaction,
      delivery: pendingTransaction.delivery,
    };
  }

  private productQuantityIsNotAvailable(
    product: Product,
    quantity: number,
  ): boolean {
    return product.stock < quantity;
  }

  private calculateSubTotal(product: Product, quantity: number): number {
    return product.price * quantity;
  }

  private calculateDeliveryFee(): number {
    // random value between 1000 and 5000
    return Math.floor(Math.random() * 4000) + 1000;
  }

  override async getAllPendingOrderTransactionsByCustomerId(
    customerId: number,
  ): Promise<Partial<OrderTransaction>[]> {
    return await this.transactionPersistencePort.getAllPendingOrderTransactionsByCustomerId(
      customerId,
    );
  }

  override async deleteOrderTransaction(
    id: number,
    customerId: number,
  ): Promise<void> {
    const transaction =
      await this.transactionPersistencePort.getTransactionById(id);

    if (!transaction) {
      throw new TransactionNotFoundError(id.toString());
    }

    if (transaction.customer.id !== customerId) {
      throw new TransactionNotFoundError(id.toString());
    }

    if (transaction.status.name !== Status.PENDING) {
      throw new TransactionAlreadyFinishedError(id);
    }

    await this.transactionPersistencePort.deleteOrderTransaction(id);
  }

  override async finishTransactionWithCard(
    id: number,
    card: Card,
  ): Promise<OrderTransaction> {
    const transaction =
      await this.transactionPersistencePort.getTransactionById(id);

    if (!transaction) {
      throw new TransactionNotFoundError(id.toString());
    }

    if (transaction.status.name !== Status.PENDING) {
      throw new TransactionAlreadyFinishedError(transaction.id);
    }

    if (
      this.productQuantityIsNotAvailable(
        transaction.product,
        transaction.quantity,
      )
    ) {
      throw new ProductQuantityNotAvailableError();
    }

    const result = await this.paymentGatewayServicePort.pay(transaction, card);

    transaction.status =
      await this.transactionStatusPersistencePort.getTransactionStatusByName(
        this.fromPaymentStatusToTransactionStatus(result.status),
      );
    transaction.paymentGatewayTransactionId = result.id;

    if (result.status === PaymentStatus.APPROVED) {
      await this.productServicePort.updateProductStock(
        transaction.product.id,
        transaction.quantity,
      );
    }

    return await this.transactionPersistencePort.updateOrderTransaction(
      id,
      transaction,
    );
  }

  private fromPaymentStatusToTransactionStatus(status: PaymentStatus): Status {
    switch (status) {
      case PaymentStatus.APPROVED:
        return Status.APPROVED;
      case PaymentStatus.DECLINED:
        return Status.REJECTED;
      case PaymentStatus.ERROR:
        return Status.REJECTED;
      case PaymentStatus.VOIDED:
        return Status.REJECTED;
      default:
        return Status.PENDING;
    }
  }
}
