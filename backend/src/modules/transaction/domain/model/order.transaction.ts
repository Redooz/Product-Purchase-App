import { Customer } from '@/customer/domain/model/customer';
import { Product } from '@/product/domain/model/product';
import { TransactionStatus } from '@/transaction/domain/model/transaction.status';
import { Delivery } from '@/modules/delivery/domain/model/delivery';

export interface OrderTransaction {
  id?: number;
  quantity: number;
  product: Product;
  customer: Customer;
  delivery: Delivery;
  total?: number;
  status?: TransactionStatus;
  createdAt?: Date;
}
