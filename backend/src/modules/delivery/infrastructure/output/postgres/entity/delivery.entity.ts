import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('deliveries')
export class DeliveryEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  personName: string;

  @Column()
  address: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fee?: number;
}
