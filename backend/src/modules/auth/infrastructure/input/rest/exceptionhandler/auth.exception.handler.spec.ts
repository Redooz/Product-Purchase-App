import { ConflictException } from '@nestjs/common';
import { AuthExceptionHandler } from './auth.exception.handler';
import { CustomerAlreadyExistsError } from '@/customer/domain/exception/customer.already.exists.error';

describe('AuthExceptionHandler', () => {
  let authExceptionHandler: AuthExceptionHandler;

  beforeEach(() => {
    authExceptionHandler = new AuthExceptionHandler();
  });

  it('should throw ConflictException if error is CustomerAlreadyExistsError', () => {
    // Arrange
    const error = new CustomerAlreadyExistsError('Customer already exists');

    // Act & Assert
    expect(() => authExceptionHandler.handleSignup(error)).toThrow(
      ConflictException,
    );
  });

  it('should throw the original error if it is not custom', () => {
    // Arrange
    const error = new Error('Some other error');

    // Act & Assert
    expect(() => authExceptionHandler.handleSignup(error)).toThrow(error);
  });
});
