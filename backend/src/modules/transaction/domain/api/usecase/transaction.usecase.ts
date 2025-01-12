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

@Injectable()
export class TransactionUsecase extends TransactionServicePort {
  constructor(
    private readonly productServicePort: ProductServicePort,
    private readonly customerServicePort: CustomerServicePort,
    private readonly deliveryServicePort: DeliveryServicePort,
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

    const transaction =
      await this.transactionPersistencePort.startTransaction(
        pendingTransaction,
      );

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
    // random value between 1 usd and 5 usd
    return Math.floor(Math.random() * 5) + 1;
  }

  override async getAllPendingOrderTransactionsByCustomerId(
    customerId: number,
  ): Promise<Partial<OrderTransaction>[]> {
    return await this.transactionPersistencePort.getAllPendingOrderTransactionsByCustomerId(
      customerId,
    );
  }
}
