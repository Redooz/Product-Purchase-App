import { Test, TestingModule } from '@nestjs/testing';
import { OrderTransactionRepository } from './order.transaction.repository';
import { OrderTransactionEntity } from '@/transaction/infrastructure/output/postgres/entity/order.transaction.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('OrderTransactionRepository', () => {
  let orderTransactionRepository: OrderTransactionRepository;
  let repository: Repository<OrderTransactionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderTransactionRepository,
        {
          provide: getRepositoryToken(OrderTransactionEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    orderTransactionRepository = module.get<OrderTransactionRepository>(
      OrderTransactionRepository,
    );
    repository = module.get<Repository<OrderTransactionEntity>>(
      getRepositoryToken(OrderTransactionEntity),
    );
  });

  it('should create an order transaction successfully', async () => {
    // Arrange
    const orderTransaction: OrderTransactionEntity = {
      id: 1,
    } as OrderTransactionEntity;
    jest.spyOn(repository, 'save').mockResolvedValue(orderTransaction);

    // Act
    const result =
      await orderTransactionRepository.createOrderTransaction(orderTransaction);

    // Assert
    expect(result).toEqual(orderTransaction);
    expect(repository.save).toHaveBeenCalledWith(orderTransaction);
  });
});
