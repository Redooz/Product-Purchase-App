import { Test, TestingModule } from '@nestjs/testing';
import { TransactionHandler } from './transaction.handler';
import { TransactionServicePort } from '@/transaction/domain/api/transaction.service.port';
import { StartTransactionRequest } from '@/transaction/application/dto/request/start.transaction.request';
import { StartTransactionResponse } from '@/transaction/application/dto/response/start.transaction.response';
import { Request } from 'express';
import { Status } from '@/transaction/domain/model/enum/status';

describe('TransactionHandler', () => {
  let transactionHandler: TransactionHandler;
  let transactionServicePort: TransactionServicePort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionHandler,
        {
          provide: TransactionServicePort,
          useValue: {
            startTransaction: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionHandler = module.get<TransactionHandler>(TransactionHandler);
    transactionServicePort = module.get<TransactionServicePort>(
      TransactionServicePort,
    );
  });

  it('should start a transaction successfully', async () => {
    // Arrange
    const request = { user: { sub: 1 } } as unknown as Request;
    const startTransactionRequestDto: StartTransactionRequest = {
      quantity: 2,
      productId: 1,
      deliveryInfo: {
        personName: 'John Doe',
        address: '123 Main St',
        country: 'USA',
        city: 'New York',
        postalCode: '10001',
      },
    };
    const startTransactionResponse: StartTransactionResponse = {
      id: 1,
      total: 205,
      status: 'PENDING',
      deliveryFee: 5,
    };

    jest.spyOn(transactionServicePort, 'startTransaction').mockResolvedValue({
      transaction: {
        id: 1,
        total: 205,
        status: { name: Status.PENDING },
        quantity: 0,
        product: undefined,
        customer: undefined,
        delivery: undefined,
      },
      delivery: {
        personName: 'John Doe',
        address: '123 Main St',
        country: 'USA',
        city: 'New York',
        postalCode: '10001',
        fee: 5,
      },
    });

    // Act
    const result = await transactionHandler.startTransaction(
      request,
      startTransactionRequestDto,
    );

    // Assert
    expect(result).toEqual(startTransactionResponse);
  });
});
