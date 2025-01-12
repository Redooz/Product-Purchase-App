import { Test, TestingModule } from '@nestjs/testing';
import { OrderTransactionRepository } from './order.transaction.repository';
import { OrderTransactionEntity } from '@/transaction/infrastructure/output/postgres/entity/order.transaction.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from '@/transaction/domain/model/enum/status';

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

  it('should get all pending order transactions by customer id successfully', async () => {
    // Arrange
    const customerId = 1;
    const orderTransaction: OrderTransactionEntity = {
      id: 1,
      status: {
        name: Status.PENDING,
      },
      customer: {
        id: customerId,
      },
    } as OrderTransactionEntity;
    jest.spyOn(repository, 'find').mockResolvedValue([orderTransaction]);

    // Act
    const result =
      await orderTransactionRepository.getAllPendingOrderTransactionsByCustomerId(
        customerId,
      );

    // Assert
    expect(result).toEqual([orderTransaction]);
    expect(repository.find).toHaveBeenCalledWith({
      select: ['id', 'quantity', 'total'],
      relations: ['status', 'product', 'delivery'],
      where: {
        status: {
          name: Status.PENDING,
        },
        customer: {
          id: customerId,
        },
      },
    });
  });
});
