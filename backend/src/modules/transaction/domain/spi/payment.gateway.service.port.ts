import { OrderTransaction } from '@/transaction/domain/model/order.transaction';
import { Card } from '@/transaction/domain/model/card';
import { PaymentGatewayResult } from '@/transaction/domain/model/payment.gateway.result';

export abstract class PaymentGatewayServicePort {
  abstract pay(
    transaction: OrderTransaction,
    card: Card,
  ): Promise<PaymentGatewayResult>;
}
