import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionHandler } from '@/transaction/application/handler/transaction.handler';
import { TransactionExceptionHandler } from '@/transaction/infrastructure/input/exceptionhandler/transaction.exception.handler';
import { JwtAuthGuard } from '@/auth/infrastructure/external/guard/jwt.guard';
import { StartTransactionRequest } from '@/transaction/application/dto/request/start.transaction.request';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';
import { StartTransactionResponse } from '@/transaction/application/dto/response/start.transaction.response';
import { GetTransactionResponse } from '@/transaction/application/dto/response/get.transaction.response';
import { FinishTransactionRequest } from '@/transaction/application/dto/request/finish.transaction.request';
import { FinishTransactionResponse } from '@/transaction/application/dto/response/finish.transaction.response';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let transactionHandler: TransactionHandler;
  let exceptionHandler: TransactionExceptionHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionHandler,
          useValue: {
            startTransaction: jest.fn(),
            getAllPendingOrderTransactions: jest.fn(),
            finishTransaction: jest.fn(),
          },
        },
        {
          provide: TransactionExceptionHandler,
          useValue: {
            handleStartTransaction: jest.fn(),
            handleGetAllPendingTransactions: jest.fn(),
            handleFinishTransaction: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    transactionController = module.get<TransactionController>(
      TransactionController,
    );
    transactionHandler = module.get<TransactionHandler>(TransactionHandler);
    exceptionHandler = module.get<TransactionExceptionHandler>(
      TransactionExceptionHandler,
    );
  });

  it('should start a transaction successfully', async () => {
    // Arrange
    const req = {} as Request;
    const startTransactionRequest: StartTransactionRequest = {
      deliveryInfo: {
        address: 'address',
        city: 'city',
        country: 'country',
        personName: 'personName',
        postalCode: 'postalCode',
        region: 'region',
        phoneNumber: '+5511999999999',
      },
      productId: 1,
      quantity: 1,
    };
    const startTransactionResponse: StartTransactionResponse = {
      endUserPolicy: {
        type: 'type',
        acceptanceToken: 'token',
        permalink: 'url',
      },
      personalDataAuthorization: {
        type: 'type',
        acceptanceToken: 'token',
        permalink: 'url',
      },
      status: 'success',
      id: 1,
      deliveryFee: 10,
      total: 100,
    };

    jest
      .spyOn(transactionHandler, 'startTransaction')
      .mockResolvedValue(startTransactionResponse);

    // Act
    const result = await transactionController.startTransaction(
      req,
      startTransactionRequest,
    );

    // Assert
    expect(result).toEqual(startTransactionResponse);
    expect(transactionHandler.startTransaction).toHaveBeenCalledWith(
      req,
      startTransactionRequest,
    );
  });

  it('should handle an exception when an error occurs starting a transaction', async () => {
    // Arrange
    const req = {} as Request;
    const startTransactionRequest: StartTransactionRequest = {
      deliveryInfo: {
        address: 'address',
        city: 'city',
        country: 'country',
        personName: 'personName',
        postalCode: 'postalCode',
        region: 'region',
        phoneNumber: '+5511999999999',
      },
      productId: 1,
      quantity: 1,
    };

    jest
      .spyOn(transactionHandler, 'startTransaction')
      .mockRejectedValue(new BadRequestException('Bad Request'));

    jest.spyOn(exceptionHandler, 'handleStartTransaction');

    // Act
    await transactionController.startTransaction(req, startTransactionRequest);

    // Assert
    expect(exceptionHandler.handleStartTransaction).toHaveBeenCalled();
  });

  it('should get all pending transactions successfully', async () => {
    // Arrange
    const req = {} as Request;
    const pendingTransactions: GetTransactionResponse[] = [
      {
        id: 12,
        total: '6314.50',
        quantity: 10,
        status: {
          id: 1,
          name: 'PENDING',
        },
        delivery: {
          id: 15,
          personName: 'John Doe',
          address: '123 Main St',
          country: 'USA',
          city: 'New York',
          postalCode: '10001',
        },
        product: {
          id: 17,
          name: 'Modern Fresh Chicken',
          price: '631.35',
        },
      },
    ];

    jest
      .spyOn(transactionHandler, 'getAllPendingOrderTransactions')
      .mockResolvedValue(pendingTransactions);

    // Act
    const result = await transactionController.getAllPendingTransactions(req);

    // Assert
    expect(result).toEqual(pendingTransactions);
    expect(
      transactionHandler.getAllPendingOrderTransactions,
    ).toHaveBeenCalledWith(req);
  });

  it('should handle an exception when an error occurs getting all pending transactions', async () => {
    // Arrange
    const req = {} as Request;

    jest
      .spyOn(transactionHandler, 'getAllPendingOrderTransactions')
      .mockRejectedValue(new BadRequestException('Bad Request'));

    jest.spyOn(exceptionHandler, 'handleGetAllPendingTransactions');

    // Act
    await transactionController.getAllPendingTransactions(req);

    // Assert
    expect(exceptionHandler.handleGetAllPendingTransactions).toHaveBeenCalled();
  });

  it('should finish a transaction successfully', async () => {
    // Arrange
    const finishTransactionRequest: FinishTransactionRequest = {
      transactionId: 1,
      card: {
        number: '1234 5678 1234 5678',
        cvc: '123',
        cardHolder: 'John Doe',
        expYear: '23',
        expMonth: '12',
      },
    };
    const getTransactionResponse: FinishTransactionResponse = {
      id: 1,
      total: 100,
      status: 'SUCCESS',
      deliveryFee: 10,
    };

    jest
      .spyOn(transactionHandler, 'finishTransaction')
      .mockResolvedValue(getTransactionResponse);

    // Act
    const result = await transactionController.finishTransaction(
      finishTransactionRequest,
    );

    // Assert
    expect(result).toEqual(getTransactionResponse);
    expect(transactionHandler.finishTransaction).toHaveBeenCalledWith(
      finishTransactionRequest,
    );
  });

  it('should handle an exception when an error occurs finishing a transaction', async () => {
    // Arrange
    const finishTransactionRequest: FinishTransactionRequest = {
      transactionId: 1,
      card: {
        number: '1234 5678 1234 5678',
        cvc: '123',
        cardHolder: 'John Doe',
        expYear: '23',
        expMonth: '12',
      },
    };

    jest
      .spyOn(transactionHandler, 'finishTransaction')
      .mockRejectedValue(new BadRequestException('Bad Request'));

    jest.spyOn(exceptionHandler, 'handleFinishTransaction');

    // Act
    await transactionController.finishTransaction(finishTransactionRequest);

    // Assert
    expect(exceptionHandler.handleFinishTransaction).toHaveBeenCalled();
  });
});
