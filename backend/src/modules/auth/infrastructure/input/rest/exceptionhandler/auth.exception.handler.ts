import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CustomerAlreadyExistsError } from '@/customer/domain/exception/customer.already.exists.error';

@Injectable()
export class AuthExceptionHandler {
  handleSignup(error: Error): void {
    if (error instanceof CustomerAlreadyExistsError) {
      throw new ConflictException(error.message);
    }
    Logger.error('Unexpected error', error.stack, AuthExceptionHandler.name);
    throw error;
  }
}
