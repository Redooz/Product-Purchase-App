import { Delivery } from '@/modules/delivery/domain/model/delivery';

export abstract class DeliveryPersistencePort {
  abstract createDelivery(delivery: Delivery): Promise<Delivery>;
}