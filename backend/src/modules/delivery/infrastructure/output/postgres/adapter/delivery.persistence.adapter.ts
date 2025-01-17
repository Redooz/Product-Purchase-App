import { Injectable } from '@nestjs/common';
import { DeliveryPersistencePort } from '@/modules/delivery/domain/spi/delivery.persistence.port';
import { DeliveryRepository } from '@/modules/delivery/infrastructure/output/postgres/repository/delivery.repository';
import { Delivery } from '@/modules/delivery/domain/model/delivery';

@Injectable()
export class DeliveryPersistenceAdapter extends DeliveryPersistencePort {
  constructor(private readonly repository: DeliveryRepository) {
    super();
  }

  override async createDelivery(delivery: Delivery): Promise<Delivery> {
    return this.repository.createDelivery(delivery);
  }
}
