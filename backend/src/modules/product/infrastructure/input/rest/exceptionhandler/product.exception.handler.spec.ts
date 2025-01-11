import { Logger, NotFoundException } from '@nestjs/common';
import { ProductExceptionHandler } from './product.exception.handler';
import { ProductNotFoundError } from '../../../../domain/exception/product.not.found.error';

describe('ProductExceptionHandler', () => {
  let productExceptionHandler: ProductExceptionHandler;

  beforeEach(() => {
    productExceptionHandler = new ProductExceptionHandler();
  });

  it('should throw NotFoundException when ProductNotFoundError is thrown', () => {
    // Arrange
    const error = new ProductNotFoundError('Product not found');

    // Act & Assert
    expect(() => productExceptionHandler.handleGetProducts(error)).toThrow(
      NotFoundException,
    );
  });

  it('should log and rethrow unexpected errors', () => {
    // Arrange
    const error = new Error('Unexpected error');
    const loggerSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {});

    // Act & Assert
    expect(() => productExceptionHandler.handleGetProducts(error)).toThrow(
      Error,
    );
    expect(loggerSpy).toHaveBeenCalledWith(
      'Unexpected error',
      error.stack,
      'ProductExceptionHandler',
    );
  });
});
