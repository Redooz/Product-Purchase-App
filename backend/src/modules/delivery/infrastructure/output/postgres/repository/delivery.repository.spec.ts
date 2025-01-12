import { DeliveryRepository } from './delivery.repository';
import { DeliveryEntity } from '@/modules/delivery/infrastructure/output/postgres/entity/delivery.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DeliveryRepository', () => {
  let deliveryRepository: DeliveryRepository;
  let repository: Repository<DeliveryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryRepository,
        {
          provide: getRepositoryToken(DeliveryEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    deliveryRepository = module.get<DeliveryRepository>(DeliveryRepository);
    repository = module.get<Repository<DeliveryEntity>>(
      getRepositoryToken(DeliveryEntity),
    );
  });

  it('should create a delivery successfully', async () => {
    // Arrange
    const delivery: DeliveryEntity = {
      id: 1,
      address: '123 Main St',
      fee: 5,
    } as DeliveryEntity;
    jest.spyOn(repository, 'save').mockResolvedValue(delivery);

    // Act
    const result = await deliveryRepository.createDelivery(delivery);

    // Assert
    expect(result).toEqual(delivery);
    expect(repository.save).toHaveBeenCalledWith(delivery);
  });
});
