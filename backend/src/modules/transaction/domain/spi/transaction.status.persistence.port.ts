import { TransactionStatus } from '@/transaction/domain/model/transaction.status';

export abstract class TransactionStatusPersistencePort {
  abstract getTransactionStatusByName(name: string): Promise<TransactionStatus>;
}
