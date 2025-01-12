import { Injectable } from '@nestjs/common';
import { DeliveryServicePort } from '@/modules/delivery/domain/api/delivery.service.port';
import { Delivery } from '@/modules/delivery/domain/model/delivery';
import { DeliveryPersistencePort } from '@/modules/delivery/domain/spi/delivery.persistence.port';

@Injectable()
export class DeliveryUsecase extends DeliveryServicePort {
  constructor(
    private readonly deliveryPersistencePort: DeliveryPersistencePort,
  ) {
    super();
  }

  async createDelivery(delivery: Delivery): Promise<Delivery> {
    return this.deliveryPersistencePort.createDelivery(delivery);
  }
}
