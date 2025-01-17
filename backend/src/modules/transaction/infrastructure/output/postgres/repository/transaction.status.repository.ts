import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatusEntity } from '@/transaction/infrastructure/output/postgres/entity/transaction.status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionStatusRepository {
  constructor(
    @InjectRepository(TransactionStatusEntity)
    private readonly repository: Repository<TransactionStatusEntity>,
  ) {}

  async getTransactionStatusByName(
    name: string,
  ): Promise<TransactionStatusEntity> {
    return this.repository.findOne({ where: { name } });
  }
}
