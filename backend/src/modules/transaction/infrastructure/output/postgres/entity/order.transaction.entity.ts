import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { CustomerEntity } from '@/customer/infrastructure/output/postgres/entity/customer.entity';
import { ProductEntity } from '@/product/infrastructure/output/postgres/entity/product.entity';
import { TransactionStatusEntity } from '@/transaction/infrastructure/output/postgres/entity/transaction.status.entity';
import { DeliveryEntity } from '@/modules/delivery/infrastructure/output/postgres/entity/delivery.entity';

@Entity({ name: 'order_transactions' })
export class OrderTransactionEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'payment_gateway_transaction_id', nullable: true })
  paymentGatewayTransactionId?: string;

  @Column()
  quantity: number;

  @ManyToOne(() => ProductEntity, (product) => product.orderTransactions)
  @JoinColumn({ name: 'product_id' })
  product?: ProductEntity;

  @ManyToOne(() => CustomerEntity, (customer) => customer.orderTransactions)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @OneToOne(() => DeliveryEntity)
  @JoinColumn({ name: 'delivery_id' })
  delivery?: DeliveryEntity;

  @Column()
  total: number;

  @ManyToOne(
    () => TransactionStatusEntity,
    (status) => status.orderTransactions,
  )
  status: TransactionStatusEntity;

  @Column({ name: 'acceptance_token_end_user_policy' })
  acceptanceTokenEndUserPolicy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;
}
