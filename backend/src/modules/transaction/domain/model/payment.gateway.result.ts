import { PaymentStatus } from '@/transaction/domain/model/enum/payment.status';

export interface PaymentGatewayResult {
  id: string;
  status: PaymentStatus;
}
