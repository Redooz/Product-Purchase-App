import { OrderTransaction } from '@/transaction/domain/model/order.transaction';

export abstract class TransactionPersistencePort {
  abstract startTransaction(
    transaction: OrderTransaction,
  ): Promise<OrderTransaction>;

  abstract getAllPendingOrderTransactionsByCustomerId(
    customerId: number,
  ): Promise<Partial<OrderTransaction>[]>;
}
