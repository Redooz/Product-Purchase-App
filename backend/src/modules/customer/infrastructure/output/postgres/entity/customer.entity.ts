import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderTransactionEntity } from '@/transaction/infrastructure/output/postgres/entity/order.transaction.entity';

@Entity({ name: 'customers' })
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    unique: true,
  })
  email?: string;

  @Column()
  password?: string;

  @OneToMany(
    () => OrderTransactionEntity,
    (orderTransaction) => orderTransaction.customer,
  )
  orderTransactions?: OrderTransactionEntity[];
}
