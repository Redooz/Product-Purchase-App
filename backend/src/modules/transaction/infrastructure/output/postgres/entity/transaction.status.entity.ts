import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Status } from '@/transaction/domain/model/enum/status';
import { OrderTransactionEntity } from '@/transaction/infrastructure/output/postgres/entity/order.transaction.entity';

@Entity('transaction_status')
export class TransactionStatusEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  name: string;

  @OneToMany(
    () => OrderTransactionEntity,
    (orderTransaction) => orderTransaction.status,
  )
  orderTransactions?: OrderTransactionEntity[];
}
