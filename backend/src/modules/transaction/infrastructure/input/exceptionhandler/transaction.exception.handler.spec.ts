import { TransactionExceptionHandler } from './transaction.exception.handler';
import { BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { ProductQuantityNotAvailableError } from '@/transaction/domain/exception/product.quantity.not.available.error';
import { CustomerNotFoundError } from '@/customer/domain/exception/customer.not.found.error';
import { ProductNotFoundError } from '@/product/domain/exception/product.not.found.error';
import { ExceptionConstant } from '@/product/domain/constant/exception.constant';
import { TransactionAlreadyFinishedError } from '@/transaction/domain/exception/transaction.already.finished.error';
import { TransactionNotFoundError } from '@/transaction/domain/exception/transaction.not.found.error';

describe('TransactionExceptionHandler', () => {
  let transactionExceptionHandler: TransactionExceptionHandler;

  beforeEach(() => {
    transactionExceptionHandler = new TransactionExceptionHandler();
  });

  it('should throw BadRequestException for ProductQuantityNotAvailableError in handleStartTransaction', () => {
    // Arrange
    const error = new ProductQuantityNotAvailableError();

    // Act and Assert
    expect(() =>
      transactionExceptionHandler.handleStartTransaction(error),
    ).toThrow(BadRequestException);
  });

  it('should throw NotFoundException for CustomerNotFoundError in handleStartTransaction', () => {
    // Arrange
    const error = new CustomerNotFoundError(1);

    // Act and Assert
    expect(() =>
      transactionExceptionHandler.handleStartTransaction(error),
    ).toThrow(NotFoundException);
  });

  it('should throw NotFoundException for ProductNotFoundError in handleStartTransaction', () => {
    // Arrange
    const error = new ProductNotFoundError(
      ExceptionConstant.PRODUCT_NOT_FOUND_MESSAGE.replace('{id}', '1'),
    );

    // Act and Assert
    expect(() =>
      transactionExceptionHandler.handleStartTransaction(error),
    ).toThrow(NotFoundException);
  });

  it('should log and rethrow unexpected errors in handleStartTransaction', () => {
    // Arrange
    const error = new Error('Unexpected error');
    const loggerSpy = jest.spyOn(Logger, 'error').mockImplementation();

    // Act and Assert
    expect(() =>
      transactionExceptionHandler.handleStartTransaction(error),
    ).toThrow(Error);
    expect(loggerSpy).toHaveBeenCalledWith(
      'Unexpected error',
      error.stack,
      'ProductExceptionHandler',
    );
  });

  it('should log and rethrow unexpected errors in handleGetAllPendingTransactions', () => {
    // Arrange
    const error = new Error('Unexpected error');
    const loggerSpy = jest.spyOn(Logger, 'error').mockImplementation();

    // Act and Assert
    expect(() =>
      transactionExceptionHandler.handleGetAllPendingTransactions(error),
    ).toThrow(Error);
    expect(loggerSpy).toHaveBeenCalledWith(
      'Unexpected error',
      error.stack,
      'ProductExceptionHandler',
    );
  });

  it('should throw BadRequestException for TransactionAlreadyFinishedError in handleFinishTransaction', () => {
    // Arrange
    const error = new TransactionAlreadyFinishedError(1);

    // Act and Assert
    expect(() =>
      transactionExceptionHandler.handleFinishTransaction(error),
    ).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for ProductQuantityNotAvailableError in handleFinishTransaction', () => {
    // Arrange
    const error = new ProductQuantityNotAvailableError();

    // Act and Assert
    expect(() =>
      transactionExceptionHandler.handleFinishTransaction(error),
    ).toThrow(BadRequestException);
  });

  it('should throw NotFoundException for TransactionNotFoundError in handleFinishTransaction', () => {
    // Arrange
    const error = new TransactionNotFoundError('1');

    // Act and Assert
    expect(() =>
      transactionExceptionHandler.handleFinishTransaction(error),
    ).toThrow(NotFoundException);
  });

  it('should throw NotFoundException for ProductNotFoundError in handleFinishTransaction', () => {
    // Arrange
    const error = new ProductNotFoundError(
      ExceptionConstant.PRODUCT_NOT_FOUND_MESSAGE.replace('{id}', '1'),
    );

    // Act and Assert
    expect(() =>
      transactionExceptionHandler.handleFinishTransaction(error),
    ).toThrow(NotFoundException);
  });

  it('should log and rethrow unexpected errors in handleFinishTransaction', () => {
    // Arrange
    const error = new Error('Unexpected error');
    const loggerSpy = jest.spyOn(Logger, 'error').mockImplementation();

    // Act and Assert
    expect(() =>
      transactionExceptionHandler.handleFinishTransaction(error),
    ).toThrow(Error);
    expect(loggerSpy).toHaveBeenCalledWith(
      'Unexpected error',
      error.stack,
      'ProductExceptionHandler',
    );
  });
});
