import { Test, TestingModule } from '@nestjs/testing';
import { TransactionPersistenceAdapter } from './transaction.persistence.adapter';
import { OrderTransactionRepository } from '@/transaction/infrastructure/output/postgres/repository/order.transaction.repository';
import { OrderTransaction } from '@/transaction/domain/model/order.transaction';
import { OrderTransactionEntity } from '@/transaction/infrastructure/output/postgres/entity/order.transaction.entity';
import { Status } from '@/transaction/domain/model/enum/status';

describe('TransactionPersistenceAdapter', () => {
  let transactionPersistenceAdapter: TransactionPersistenceAdapter;
  let orderTransactionRepository: OrderTransactionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionPersistenceAdapter,
        {
          provide: OrderTransactionRepository,
          useValue: {
            createOrderTransaction: jest.fn(),
            getAllPendingOrderTransactionsByCustomerId: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionPersistenceAdapter = module.get<TransactionPersistenceAdapter>(
      TransactionPersistenceAdapter,
    );
    orderTransactionRepository = module.get<OrderTransactionRepository>(
      OrderTransactionRepository,
    );
  });

  it('should start a transaction successfully', async () => {
    // Arrange
    const orderTransaction: OrderTransaction = {
      customer: { id: 1 },
      product: { id: 1 },
      quantity: 2,
      total: 200,
      delivery: { fee: 5 },
      status: { id: 1, name: Status.PENDING },
      acceptanceEndUserPolicy: {
        acceptanceToken: 'token',
      },
    } as OrderTransaction;
    const orderTransactionEntity: OrderTransactionEntity = {
      id: 1,
      customer: orderTransaction.customer,
      product: orderTransaction.product,
      quantity: orderTransaction.quantity,
      total: orderTransaction.total,
      delivery: orderTransaction.delivery,
      status: { id: 1, name: Status.PENDING },
      createdAt: new Date(),
      acceptanceTokenEndUserPolicy: 'token',
    } as OrderTransactionEntity;

    jest
      .spyOn(orderTransactionRepository, 'createOrderTransaction')
      .mockResolvedValue(orderTransactionEntity);

    // Act
    const result =
      await transactionPersistenceAdapter.startTransaction(orderTransaction);

    // Assert
    expect(result).toEqual({
      id: 1,
      customer: orderTransaction.customer,
      product: {
        id: orderTransaction.product.id,
        name: undefined,
        description: undefined,
        price: undefined,
        stock: undefined,
        image: undefined,
      },
      quantity: orderTransaction.quantity,
      total: orderTransaction.total,
      delivery: orderTransaction.delivery,
      status: { id: 1, name: Status.PENDING },
      createdAt: orderTransactionEntity.createdAt,
      acceptanceEndUserPolicy: {
        acceptanceToken: 'token',
        type: 'END_USER_POLICY',
      },
    });
  });

  it('should get all pending order transactions by customer id successfully', async () => {
    // Arrange
    const customerId = 1;
    const orderTransactionEntity: OrderTransactionEntity = {
      id: 1,
      customer: { id: customerId },
      product: { id: 1 },
      quantity: 2,
      total: 200,
      delivery: { fee: 5 },
      status: { id: 1, name: Status.PENDING },
      createdAt: new Date(),
    } as OrderTransactionEntity;

    jest
      .spyOn(
        orderTransactionRepository,
        'getAllPendingOrderTransactionsByCustomerId',
      )
      .mockResolvedValue([orderTransactionEntity]);

    // Act
    const result =
      await transactionPersistenceAdapter.getAllPendingOrderTransactionsByCustomerId(
        customerId,
      );

    // Assert
    expect(result[0].id).toEqual(1);
  });
});
