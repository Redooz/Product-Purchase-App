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

  async getOrderTransactionById(id: number): Promise<OrderTransactionEntity> {
    return await this.repository.findOne({
      where: { id },
      relations: ['status', 'product', 'delivery', 'customer'],
    });
  }

  async updateOrderTransaction(
    id: number,
    orderTransaction: Partial<OrderTransactionEntity>,
  ): Promise<OrderTransactionEntity> {
    await this.repository.update(id, orderTransaction);
    return await this.repository.findOne({
      where: { id },
      relations: ['status', 'product', 'delivery'],
    });
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

  async deleteOrderTransaction(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
