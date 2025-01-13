import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('deliveries')
export class DeliveryEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'person_name' })
  personName: string;

  @Column()
  address: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  region: string;

  @Column({ name: 'postal_code' })
  postalCode: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fee?: number;
}
