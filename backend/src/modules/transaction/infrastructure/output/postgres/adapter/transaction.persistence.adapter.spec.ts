import { Test, TestingModule } from '@nestjs/testing';
import { TransactionPersistenceAdapter } from './transaction.persistence.adapter';
import { OrderTransactionRepository } from '@/transaction/infrastructure/output/postgres/repository/order.transaction.repository';
import { OrderTransaction } from '@/transaction/domain/model/order.transaction';
import { OrderTransactionEntity } from '@/transaction/infrastructure/output/postgres/entity/order.transaction.entity';
import { Status } from '@/transaction/domain/model/enum/status';
import { AcceptanceType } from '@/transaction/domain/model/enum/acceptance.type';

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
            getOrderTransactionById: jest.fn(),
            updateOrderTransaction: jest.fn(),
            deleteOrderTransaction: jest.fn(),
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

  it('should get a transaction by id successfully', async () => {
    const transactionId = 1;
    const orderTransactionEntity: OrderTransactionEntity = {
      id: transactionId,
      customer: { id: 1 },
      product: { id: 1 },
      quantity: 2,
      total: 200,
      delivery: { fee: 5 },
      status: { id: 1, name: Status.PENDING },
      createdAt: new Date(),
    } as OrderTransactionEntity;

    jest
      .spyOn(orderTransactionRepository, 'getOrderTransactionById')
      .mockResolvedValue(orderTransactionEntity);

    const result =
      await transactionPersistenceAdapter.getTransactionById(transactionId);

    expect(result).toEqual({
      id: transactionId,
      customer: orderTransactionEntity.customer,
      product: {
        id: orderTransactionEntity.product.id,
        name: undefined,
        description: undefined,
        price: undefined,
        stock: undefined,
        image: undefined,
      },
      quantity: orderTransactionEntity.quantity,
      total: orderTransactionEntity.total,
      delivery: orderTransactionEntity.delivery,
      status: { id: 1, name: Status.PENDING },
      createdAt: orderTransactionEntity.createdAt,
      acceptanceEndUserPolicy: {
        acceptanceToken: undefined,
        type: 'END_USER_POLICY',
      },
    });
  });

  it('should return null if transaction id does not exist', async () => {
    const transactionId = 999;

    jest
      .spyOn(orderTransactionRepository, 'getOrderTransactionById')
      .mockResolvedValue(null);

    const result =
      await transactionPersistenceAdapter.getTransactionById(transactionId);

    expect(result).toBeNull();
  });

  it('should update an order transaction successfully', async () => {
    const transactionId = 1;
    const orderTransaction: Partial<OrderTransaction> = {
      acceptanceEndUserPolicy: {
        acceptanceToken: 'token',
        type: AcceptanceType.END_USER_POLICY,
        permalink: 'permalink',
      },
      quantity: 3,
      total: 300,
      status: { id: 2, name: Status.APPROVED },
    };
    const updatedOrderTransactionEntity: OrderTransactionEntity = {
      id: transactionId,
      customer: { id: 1 },
      product: { id: 1 },
      quantity: 3,
      total: 300,
      delivery: { fee: 5 },
      status: { id: 2, name: Status.APPROVED },
      createdAt: new Date(),
    } as OrderTransactionEntity;

    jest
      .spyOn(orderTransactionRepository, 'updateOrderTransaction')
      .mockResolvedValue(updatedOrderTransactionEntity);

    const result = await transactionPersistenceAdapter.updateOrderTransaction(
      transactionId,
      orderTransaction,
    );

    expect(result).toEqual({
      id: transactionId,
      customer: updatedOrderTransactionEntity.customer,
      product: {
        id: updatedOrderTransactionEntity.product.id,
        name: undefined,
        description: undefined,
        price: undefined,
        stock: undefined,
        image: undefined,
      },
      quantity: updatedOrderTransactionEntity.quantity,
      total: updatedOrderTransactionEntity.total,
      delivery: updatedOrderTransactionEntity.delivery,
      status: { id: 2, name: Status.APPROVED },
      createdAt: updatedOrderTransactionEntity.createdAt,
      acceptanceEndUserPolicy: {
        acceptanceToken: undefined,
        type: 'END_USER_POLICY',
      },
    });
  });

  it('should delete an order transaction successfully', async () => {
    // Arrange
    const transactionId = 1;
    jest
      .spyOn(orderTransactionRepository, 'deleteOrderTransaction')
      .mockResolvedValue(undefined);

    await transactionPersistenceAdapter.deleteOrderTransaction(transactionId);

    // Assert
    expect(
      orderTransactionRepository.deleteOrderTransaction,
    ).toHaveBeenCalledWith(transactionId);
  });
});
