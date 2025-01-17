import { Test, TestingModule } from '@nestjs/testing';
import { TransactionStatusPersistenceAdapter } from './transaction.status.persistence.adapter';
import { TransactionStatusRepository } from '@/transaction/infrastructure/output/postgres/repository/transaction.status.repository';
import { Status } from '@/transaction/domain/model/enum/status';
import { TransactionStatus } from '@/transaction/domain/model/transaction.status';

describe('TransactionStatusPersistenceAdapter', () => {
  let transactionStatusPersistenceAdapter: TransactionStatusPersistenceAdapter;
  let transactionStatusRepository: TransactionStatusRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionStatusPersistenceAdapter,
        {
          provide: TransactionStatusRepository,
          useValue: {
            getTransactionStatusByName: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionStatusPersistenceAdapter =
      module.get<TransactionStatusPersistenceAdapter>(
        TransactionStatusPersistenceAdapter,
      );
    transactionStatusRepository = module.get<TransactionStatusRepository>(
      TransactionStatusRepository,
    );
  });

  it('should return transaction status by name', async () => {
    // Arrange
    const statusName = Status.PENDING;
    const transactionStatus = { id: 1, name: statusName } as TransactionStatus;
    jest
      .spyOn(transactionStatusRepository, 'getTransactionStatusByName')
      .mockResolvedValue(transactionStatus);

    // Act
    const result =
      await transactionStatusPersistenceAdapter.getTransactionStatusByName(
        statusName,
      );

    // Assert
    expect(result).toEqual({ id: 1, name: Status.PENDING });
    expect(
      transactionStatusRepository.getTransactionStatusByName,
    ).toHaveBeenCalledWith(statusName);
  });
});
