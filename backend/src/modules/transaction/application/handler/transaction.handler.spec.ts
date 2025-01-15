import { Test, TestingModule } from '@nestjs/testing';
import { TransactionHandler } from './transaction.handler';
import { TransactionServicePort } from '@/transaction/domain/api/transaction.service.port';
import { StartTransactionRequest } from '@/transaction/application/dto/request/start.transaction.request';
import { StartTransactionResponse } from '@/transaction/application/dto/response/start.transaction.response';
import { Request } from 'express';
import { Status } from '@/transaction/domain/model/enum/status';
import { AcceptanceType } from '@/transaction/domain/model/enum/acceptance.type';
import { FinishTransactionRequest } from '@/transaction/application/dto/request/finish.transaction.request';
import { FinishTransactionResponse } from '@/transaction/application/dto/response/finish.transaction.response';
import { OrderTransaction } from '@/transaction/domain/model/order.transaction';

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
            getAllPendingOrderTransactionsByCustomerId: jest.fn(),
            finishTransactionWithCard: jest.fn(),
            deleteOrderTransaction: jest.fn(),
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
        region: 'NY',
        phoneNumber: '+5511999999999',
      },
    };
    const startTransactionResponse: StartTransactionResponse = {
      endUserPolicy: {
        type: AcceptanceType.END_USER_POLICY,
        acceptanceToken: 'token',
        permalink: 'permalink',
      },
      personalDataAuthorization: {
        type: AcceptanceType.PERSONAL_DATA_AUTHORIZATION,
        acceptanceToken: 'token',
        permalink: 'permalink',
      },
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
        acceptanceEndUserPolicy: {
          acceptanceToken: 'token',
          type: AcceptanceType.END_USER_POLICY,
          permalink: 'permalink',
        },
        acceptancePersonalDataAuthorization: {
          acceptanceToken: 'token',
          type: AcceptanceType.PERSONAL_DATA_AUTHORIZATION,
          permalink: 'permalink',
        },
      },
      delivery: {
        personName: 'John Doe',
        address: '123 Main St',
        country: 'USA',
        city: 'New York',
        postalCode: '10001',
        fee: 5,
        region: 'NY',
        phoneNumber: '+5511999999999',
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

  it('should get all pending order transactions successfully', async () => {
    // Arrange
    const request = {
      user: { sub: 1 },
    } as unknown as Request;
    const getTransactionResponse = [
      {
        id: 1,
        total: '205',
        quantity: 2,
        status: {
          id: 1,
          name: Status.PENDING,
        },
        delivery: {
          id: 1,
          personName: 'John Doe',
          address: '123 Main St',
          country: 'USA',
          city: 'New York',
          postalCode: '10001',
        },
      },
    ];

    jest
      .spyOn(
        transactionServicePort,
        'getAllPendingOrderTransactionsByCustomerId',
      )
      .mockResolvedValue([
        {
          id: 1,
          total: 205,
          quantity: 2,
          status: { id: 1, name: Status.PENDING },
          delivery: {
            id: 1,
            personName: 'John Doe',
            address: '123 Main St',
            country: 'USA',
            city: 'New York',
            postalCode: '10001',
            region: 'NY',
            phoneNumber: '+5511999999999',
          },
          product: {
            id: 1,
            name: 'Product 1',
            price: 100,
          },
        },
      ]);

    // Act
    const result =
      await transactionHandler.getAllPendingOrderTransactions(request);

    // Assert
    expect(result[0].id).toEqual(getTransactionResponse[0].id);
  });

  it('should finish a transaction successfully', async () => {
    // Arrange
    const finishTransactionRequest: FinishTransactionRequest = {
      transactionId: 1,
      card: {
        number: '1234567890123456',
        cvc: '123',
        cardHolder: 'John Doe',
        expYear: '28',
        expMonth: '12',
      },
    };
    const finishTransactionResponse: FinishTransactionResponse = {
      id: 1,
      total: 205,
      status: 'PENDING',
      deliveryFee: 5,
    };
    const orderTransaction: OrderTransaction = {
      customer: undefined,
      product: undefined,
      quantity: 0,
      id: 1,
      total: 205,
      status: { name: Status.PENDING },
      delivery: {
        fee: 5,
        region: 'NY',
        phoneNumber: '+5511999999999',
        address: '123 Main St',
        country: 'US',
        city: 'New York',
        postalCode: '10001',
        personName: 'John Doe',
      },
    };

    jest
      .spyOn(transactionServicePort, 'finishTransactionWithCard')
      .mockResolvedValue(orderTransaction);

    // Act
    const result = await transactionHandler.finishTransaction(
      finishTransactionRequest,
    );

    // Assert
    expect(result).toEqual(finishTransactionResponse);
  });

  it('should delete a transaction successfully', async () => {
    // Arrange
    const request = {
      user: { sub: 1 },
    } as unknown as Request;
    const transactionId = 1;

    jest
      .spyOn(transactionServicePort, 'deleteOrderTransaction')
      .mockResolvedValue();

    // Act
    await transactionHandler.deleteTransaction(transactionId, request);

    // Assert
    expect(transactionServicePort.deleteOrderTransaction).toHaveBeenCalledWith(
      transactionId,
      1,
    );
  });
});
