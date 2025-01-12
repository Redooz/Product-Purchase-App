import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderTransactionEntity } from '@/transaction/infrastructure/output/postgres/entity/order.transaction.entity';
import { Repository } from 'typeorm';
import { Status } from '@/transaction/domain/model/enum/status';

@Injectable()
export class OrderTransactionRepository {
  constructor(
    @InjectRepository(OrderTransactionEntity)
    private readonly repository: Repository<OrderTransactionEntity>,
  ) {}

  async createOrderTransaction(
    orderTransaction: OrderTransactionEntity,
  ): Promise<OrderTransactionEntity> {
    return await this.repository.save(orderTransaction);
  }

  async getAllPendingOrderTransactionsByCustomerId(
    customerId: number,
  ): Promise<OrderTransactionEntity[]> {
    return await this.repository.find({
      select: ['id', 'quantity', 'total'],
      relations: ['status', 'product', 'delivery'],
      where: {
        status: {
          name: Status.PENDING,
        },
        customer: {
          id: customerId,
        },
      },
    });
  }
}
