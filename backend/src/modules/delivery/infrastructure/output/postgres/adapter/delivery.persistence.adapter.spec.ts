import { DeliveryPersistenceAdapter } from './delivery.persistence.adapter';
import { DeliveryRepository } from '@/modules/delivery/infrastructure/output/postgres/repository/delivery.repository';
import { Delivery } from '@/modules/delivery/domain/model/delivery';
import { Test, TestingModule } from '@nestjs/testing';

describe('DeliveryPersistenceAdapter', () => {
  let deliveryPersistenceAdapter: DeliveryPersistenceAdapter;
  let deliveryRepository: DeliveryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryPersistenceAdapter,
        {
          provide: DeliveryRepository,
          useValue: {
            createDelivery: jest.fn(),
          },
        },
      ],
    }).compile();

    deliveryPersistenceAdapter = module.get<DeliveryPersistenceAdapter>(
      DeliveryPersistenceAdapter,
    );
    deliveryRepository = module.get<DeliveryRepository>(DeliveryRepository);
  });

  it('should create a delivery successfully', async () => {
    // Arrange
    const delivery: Delivery = {
      id: 1,
      address: '123 Main St',
      fee: 5,
      personName: 'John Doe',
      country: 'US',
      city: 'New York',
      postalCode: '10001',
    };
    jest
      .spyOn(deliveryRepository, 'createDelivery')
      .mockResolvedValue(delivery);

    // Act
    const result = await deliveryPersistenceAdapter.createDelivery(delivery);

    // Assert
    expect(result).toEqual(delivery);
    expect(deliveryRepository.createDelivery).toHaveBeenCalledWith(delivery);
  });
});
