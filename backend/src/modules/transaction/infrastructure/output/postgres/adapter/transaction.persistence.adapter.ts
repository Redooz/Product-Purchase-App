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

    return this.mapOrderTransactionEntityToOrderTransaction(
      savedOrderTransaction,
    );
  }

  override async getTransactionById(
    id: number,
  ): Promise<OrderTransaction | null> {
    const orderTransactionEntity =
      await this.orderTransactionRepository.getOrderTransactionById(id);

    if (!orderTransactionEntity) {
      return null;
    }

    return this.mapOrderTransactionEntityToOrderTransaction(
      orderTransactionEntity,
    );
  }

  override async getAllPendingOrderTransactionsByCustomerId(
    customerId: number,
  ): Promise<Partial<OrderTransaction>[]> {
    const pendingOrderTransactions =
      await this.orderTransactionRepository.getAllPendingOrderTransactionsByCustomerId(
        customerId,
      );

    return pendingOrderTransactions.map(
      this.mapOrderTransactionEntityToPartialOrderTransaction,
    );
  }

  override async updateOrderTransaction(
    id: number,
    orderTransaction: Partial<OrderTransaction>,
  ): Promise<OrderTransaction> {
    const updatedOrderTransaction =
      await this.orderTransactionRepository.updateOrderTransaction(
        id,
        this.mapOrderTransactionModelToEntity(orderTransaction),
      );

    return this.mapOrderTransactionEntityToOrderTransaction(
      updatedOrderTransaction,
    );
  }

  private mapOrderTransactionModelToEntity(
    transaction: Partial<OrderTransaction>,
  ): OrderTransactionEntity {
    return {
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
      paymentGatewayTransactionId: transaction.paymentGatewayTransactionId,
    };
  }

  private mapOrderTransactionEntityToOrderTransaction(
    entity: OrderTransactionEntity,
  ): OrderTransaction {
    return {
      acceptanceEndUserPolicy: {
        acceptanceToken: entity.acceptanceTokenEndUserPolicy,
        type: AcceptanceType.END_USER_POLICY,
      },
      id: entity.id,
      customer: entity.customer,
      product: {
        id: entity.product.id,
        name: entity.product.name,
        description: entity.product.description,
        price: entity.product.price,
        stock: entity.product.stock,
        image: entity.product.image,
      },
      quantity: entity.quantity,
      total: entity.total,
      delivery: entity.delivery,
      status: {
        id: entity.status.id,
        name: entity.status.name as Status,
      },
      createdAt: entity.createdAt,
    };
  }

  private mapOrderTransactionEntityToPartialOrderTransaction(
    entity: OrderTransactionEntity,
  ): Partial<OrderTransaction> {
    return {
      id: entity.id,
      quantity: entity.quantity,
      total: entity.total,
      delivery: {
        id: entity.delivery.id,
        personName: entity.delivery.personName,
        address: entity.delivery.address,
        country: entity.delivery.country,
        city: entity.delivery.city,
        postalCode: entity.delivery.postalCode,
        region: entity.delivery.region,
        phoneNumber: entity.delivery.phoneNumber,
      },
      product: {
        id: entity.product.id,
        name: entity.product.name,
        price: entity.product.price,
      },
      status: {
        id: entity.status.id,
        name: entity.status.name as Status,
      },
    };
  }
}
