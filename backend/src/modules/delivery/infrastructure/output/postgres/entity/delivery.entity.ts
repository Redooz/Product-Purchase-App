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
}
