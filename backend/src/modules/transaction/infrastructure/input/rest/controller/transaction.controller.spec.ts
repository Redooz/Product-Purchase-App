import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionHandler } from '@/transaction/application/handler/transaction.handler';
import { TransactionExceptionHandler } from '@/transaction/infrastructure/input/exceptionhandler/transaction.exception.handler';
import { JwtAuthGuard } from '@/auth/infrastructure/external/guard/jwt.guard';
import { StartTransactionRequest } from '@/transaction/application/dto/request/start.transaction.request';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';
import { StartTransactionResponse } from '@/transaction/application/dto/response/start.transaction.response';

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
          },
        },
        {
          provide: TransactionExceptionHandler,
          useValue: {
            handleStartTransaction: jest.fn(),
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
      },
      productId: 1,
      quantity: 1,
    };
    const startTransactionResponse: StartTransactionResponse = {
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

  it('should handle an exception when an error occurs', async () => {
    // Arrange
    const req = {} as Request;
    const startTransactionRequest: StartTransactionRequest = {
      deliveryInfo: {
        address: 'address',
        city: 'city',
        country: 'country',
        personName: 'personName',
        postalCode: 'postalCode',
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
});
