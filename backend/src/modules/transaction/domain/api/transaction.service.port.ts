import { OrderTransaction } from '@/transaction/domain/model/order.transaction';
import { Delivery } from '@/modules/delivery/domain/model/delivery';

export abstract class TransactionServicePort {
  abstract startTransaction(
    transaction: OrderTransaction,
  ): Promise<{ transaction: OrderTransaction; delivery: Delivery }>;

  abstract getAllPendingOrderTransactionsByCustomerId(customerId: number): Promise<Partial<OrderTransaction>[]>;
}
