import { Test, TestingModule } from '@nestjs/testing';
import { TransactionStatusRepository } from './transaction.status.repository';
import { TransactionStatusEntity } from '@/transaction/infrastructure/output/postgres/entity/transaction.status.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('TransactionStatusRepository', () => {
  let transactionStatusRepository: TransactionStatusRepository;
  let repository: Repository<TransactionStatusEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionStatusRepository,
        {
          provide: getRepositoryToken(TransactionStatusEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    transactionStatusRepository = module.get<TransactionStatusRepository>(
      TransactionStatusRepository,
    );
    repository = module.get<Repository<TransactionStatusEntity>>(
      getRepositoryToken(TransactionStatusEntity),
    );
  });

  it('should return transaction status by name', async () => {
    // Arrange
    const statusName = 'PENDING';
    const transactionStatus: TransactionStatusEntity = {
      id: 1,
      name: statusName,
    } as TransactionStatusEntity;
    jest.spyOn(repository, 'findOne').mockResolvedValue(transactionStatus);

    // Act
    const result =
      await transactionStatusRepository.getTransactionStatusByName(statusName);

    // Assert
    expect(result).toEqual(transactionStatus);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { name: statusName },
    });
  });
});
