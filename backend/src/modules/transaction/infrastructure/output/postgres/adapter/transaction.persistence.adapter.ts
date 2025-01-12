import { TransactionPersistencePort } from '@/transaction/domain/spi/transaction.persistence.port';
import { OrderTransactionRepository } from '@/transaction/infrastructure/output/postgres/repository/order.transaction.repository';
import { OrderTransaction } from '@/transaction/domain/model/order.transaction';
import { OrderTransactionEntity } from '@/transaction/infrastructure/output/postgres/entity/order.transaction.entity';
import { Status } from '@/transaction/domain/model/enum/status';
import { Injectable } from '@nestjs/common';
import { AcceptanceType } from '@/transaction/domain/model/enum/acceptance.type';

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
      acceptanceTokenEndUserPolicy:
        transaction.acceptanceEndUserPolicy.acceptanceToken,
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
      acceptanceEndUserPolicy: {
        acceptanceToken: savedOrderTransaction.acceptanceTokenEndUserPolicy,
        type: AcceptanceType.END_USER_POLICY,
      },
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

  override async getAllPendingOrderTransactionsByCustomerId(
    customerId: number,
  ): Promise<Partial<OrderTransaction>[]> {
    const pendingOrderTransactions =
      await this.orderTransactionRepository.getAllPendingOrderTransactionsByCustomerId(
        customerId,
      );

    return pendingOrderTransactions.map((orderTransaction) => ({
      id: orderTransaction.id,
      quantity: orderTransaction.quantity,
      total: orderTransaction.total,
      delivery: {
        id: orderTransaction.delivery.id,
        personName: orderTransaction.delivery.personName,
        address: orderTransaction.delivery.address,
        country: orderTransaction.delivery.country,
        city: orderTransaction.delivery.city,
        postalCode: orderTransaction.delivery.postalCode,
        region: orderTransaction.delivery.region,
        phoneNumber: orderTransaction.delivery.phoneNumber,
      },
      product: {
        id: orderTransaction.product.id,
        name: orderTransaction.product.name,
        price: orderTransaction.product.price,
      },
      status: {
        id: orderTransaction.status.id,
        name: orderTransaction.status.name as Status,
      },
    }));
  }
}
