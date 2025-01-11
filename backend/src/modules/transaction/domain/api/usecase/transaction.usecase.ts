import { TransactionServicePort } from '@/transaction/domain/api/transaction.service.port';
import { Injectable } from '@nestjs/common';
import { OrderTransaction } from '@/transaction/domain/model/order.transaction';
import { ProductServicePort } from '@/product/domain/api/product.service.port';
import { Status } from '@/transaction/domain/model/enum/status';
import { Product } from '@/product/domain/model/product';
import { CustomerServicePort } from '@/customer/domain/api/customer.service.port';
import { TransactionPersistencePort } from '@/transaction/domain/spi/transaction.persistence.port';
import { ProductQuantityNotAvailableError } from '@/transaction/domain/exception/product.quantity.not.available.error';

@Injectable()
export class TransactionUsecase extends TransactionServicePort {
  constructor(
    private readonly transactionPersistencePort: TransactionPersistencePort,
    private readonly productServicePort: ProductServicePort,
    private readonly customerServicePort: CustomerServicePort,
  ) {
    super();
  }

  override async startTransaction(
    pendingTransaction: OrderTransaction,
  ): Promise<OrderTransaction> {
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
    pendingTransaction.total = this.calculateTotal(
      product,
      pendingTransaction.quantity,
    );
    pendingTransaction.status = { status: Status.PENDING };

    // using cascade, the delivery info will be saved as well
    return this.transactionPersistencePort.startTransaction(pendingTransaction);
  }

  private productQuantityIsNotAvailable(
    product: Product,
    quantity: number,
  ): boolean {
    return product.stock < quantity;
  }

  private calculateTotal(product: Product, quantity: number): number {
    return product.price * quantity;
  }
}
