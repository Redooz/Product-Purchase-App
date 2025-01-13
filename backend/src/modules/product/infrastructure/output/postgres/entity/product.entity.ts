import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderTransactionEntity } from '@/transaction/infrastructure/output/postgres/entity/order.transaction.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column()
  description?: string;

  @Column()
  price?: number;

  @Column()
  stock?: number;

  @Column({ nullable: true })
  image?: string;

  @OneToMany(
    () => OrderTransactionEntity,
    (orderTransaction) => orderTransaction.product,
  )
  orderTransactions?: OrderTransactionEntity[];
}
