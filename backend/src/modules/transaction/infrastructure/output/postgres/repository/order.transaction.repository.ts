import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderTransactionEntity } from '@/transaction/infrastructure/output/postgres/entity/order.transaction.entity';
import { Repository } from 'typeorm';

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
}
