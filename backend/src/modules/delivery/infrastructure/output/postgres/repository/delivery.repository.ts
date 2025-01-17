import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryEntity } from '@/modules/delivery/infrastructure/output/postgres/entity/delivery.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeliveryRepository {
  constructor(
    @InjectRepository(DeliveryEntity)
    private readonly repository: Repository<DeliveryEntity>,
  ) {}

  async createDelivery(delivery: DeliveryEntity): Promise<DeliveryEntity> {
    return this.repository.save(delivery);
  }
}
