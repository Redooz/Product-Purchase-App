import { Injectable } from '@nestjs/common';
import { TransactionStatusPersistencePort } from '@/transaction/domain/spi/transaction.status.persistence.port';
import { TransactionStatus } from '@/transaction/domain/model/transaction.status';
import { TransactionStatusRepository } from '@/transaction/infrastructure/output/postgres/repository/transaction.status.repository';
import { Status } from '@/transaction/domain/model/enum/status';

@Injectable()
export class TransactionStatusPersistenceAdapter extends TransactionStatusPersistencePort {
  constructor(
    private readonly transactionStatusRepository: TransactionStatusRepository,
  ) {
    super();
  }

  override async getTransactionStatusByName(
    name: string,
  ): Promise<TransactionStatus> {
    const status =
      await this.transactionStatusRepository.getTransactionStatusByName(name);

    return {
      id: status.id,
      name: status.name as Status,
    };
  }
}
