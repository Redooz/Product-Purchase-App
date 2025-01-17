import { Delivery } from '@/modules/delivery/domain/model/delivery';

export abstract class DeliveryServicePort {
  abstract createDelivery(delivery: Delivery): Promise<Delivery>;
}
