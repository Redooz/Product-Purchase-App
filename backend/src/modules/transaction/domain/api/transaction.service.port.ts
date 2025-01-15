import { OrderTransaction } from '@/transaction/domain/model/order.transaction';
import { Delivery } from '@/modules/delivery/domain/model/delivery';
import { Card } from '@/transaction/domain/model/card';

export abstract class TransactionServicePort {
  abstract startTransaction(
    transaction: OrderTransaction,
  ): Promise<{ transaction: OrderTransaction; delivery: Delivery }>;

  abstract getAllPendingOrderTransactionsByCustomerId(
    customerId: number,
  ): Promise<Partial<OrderTransaction>[]>;

  abstract finishTransactionWithCard(
    id: number,
    card: Card,
  ): Promise<OrderTransaction>;

  abstract deleteOrderTransaction(id: number, customerId: number): Promise<void>;
}
