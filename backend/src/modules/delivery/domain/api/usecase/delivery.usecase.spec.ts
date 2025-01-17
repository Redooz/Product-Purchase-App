import { DeliveryUsecase } from './delivery.usecase';
import { DeliveryPersistencePort } from '@/modules/delivery/domain/spi/delivery.persistence.port';
import { Delivery } from '@/modules/delivery/domain/model/delivery';

describe('DeliveryUsecase', () => {
  let deliveryUsecase: DeliveryUsecase;
  let deliveryPersistencePort: DeliveryPersistencePort;

  beforeEach(() => {
    deliveryPersistencePort = {
      createDelivery: jest.fn(),
    } as unknown as DeliveryPersistencePort;
    deliveryUsecase = new DeliveryUsecase(deliveryPersistencePort);
  });

  it('should create a delivery successfully', async () => {
    // Arrange
    const delivery: Delivery = {
      phoneNumber: '+5511999999999',
      region: 'NY',
      id: 1,
      address: '123 Main St',
      fee: 5,
      city: 'New York',
      country: 'USA',
      personName: 'John Doe',
      postalCode: '10001'
    };
    jest
      .spyOn(deliveryPersistencePort, 'createDelivery')
      .mockResolvedValue(delivery);

    // Act
    const result = await deliveryUsecase.createDelivery(delivery);

    // Assert
    expect(result).toEqual(delivery);
    expect(deliveryPersistencePort.createDelivery).toHaveBeenCalledWith(
      delivery,
    );
  });
});
