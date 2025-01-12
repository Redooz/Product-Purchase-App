import { TransactionPersistencePort } from '@/transaction/domain/spi/transaction.persistence.port';
import { OrderTransactionRepository } from '@/transaction/infrastructure/output/postgres/repository/order.transaction.repository';
import { OrderTransaction } from '@/transaction/domain/model/order.transaction';
import { OrderTransactionEntity } from '@/transaction/infrastructure/output/postgres/entity/order.transaction.entity';
import { Status } from '@/transaction/domain/model/enum/status';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionPersistenceAdapter extends TransactionPersistencePort {
  constructor(
    private readonly orderTransactionRepository: OrderTransactionRepository,
  ) {
    super();
  }

  override async startTransaction(
    transaction: OrderTransaction,
  ): Promise<OrderTransaction> {
    const orderTransactionEntity: OrderTransactionEntity = {
      customer: transaction.customer,
      product: transaction.product,
      quantity: transaction.quantity,
      total: transaction.total,
      delivery: transaction.delivery,
      status: {
        id: transaction.status.id,
        name: transaction.status.name,
      },
    };

    const savedOrderTransaction =
      await this.orderTransactionRepository.createOrderTransaction(
        orderTransactionEntity,
      );

    return {
      id: savedOrderTransaction.id,
      customer: savedOrderTransaction.customer,
      product: {
        id: savedOrderTransaction.product.id,
        name: savedOrderTransaction.product.name,
        description: savedOrderTransaction.product.description,
        price: savedOrderTransaction.product.price,
        stock: savedOrderTransaction.product.stock,
        image: savedOrderTransaction.product.image,
      },
      quantity: savedOrderTransaction.quantity,
      total: savedOrderTransaction.total,
      delivery: savedOrderTransaction.delivery,
      status: {
        id: savedOrderTransaction.status.id,
        name: savedOrderTransaction.status.name as Status,
      },
      createdAt: savedOrderTransaction.createdAt,
    };
  }
}
