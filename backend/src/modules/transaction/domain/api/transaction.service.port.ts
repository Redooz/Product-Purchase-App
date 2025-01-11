import { OrderTransaction } from '@/transaction/domain/model/order.transaction';

export abstract class TransactionServicePort {
  abstract startTransaction(
    transaction: OrderTransaction,
  ): Promise<OrderTransaction>;
}
