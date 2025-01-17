import { Customer } from '@/customer/domain/model/customer';
import { Product } from '@/product/domain/model/product';
import { TransactionStatus } from '@/transaction/domain/model/transaction.status';
import { Delivery } from '@/modules/delivery/domain/model/delivery';
import { Acceptance } from '@/transaction/domain/model/acceptance';

export interface OrderTransaction {
  id?: number;
  paymentGatewayTransactionId?: string;
  quantity: number;
  product: Product;
  customer: Customer;
  delivery: Delivery;
  total?: number;
  status?: TransactionStatus;
  acceptanceEndUserPolicy?: Acceptance;
  acceptancePersonalDataAuthorization?: Acceptance;
  createdAt?: Date;
}
