import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ProductExceptionHandler } from '@/product/infrastructure/input/rest/exceptionhandler/product.exception.handler';

@Injectable()
export class TransactionExceptionHandler {
  handleStartTransaction(error: Error): void {
    switch (error.constructor.name) {
      case 'ProductQuantityNotAvailableError':
        throw new BadRequestException(error.message);
      case 'CustomerNotFoundError':
        throw new NotFoundException(error.message);
      case 'ProductNotFoundError':
        throw new NotFoundException(error.message);
      default:
        Logger.error(
          'Unexpected error',
          error.stack,
          ProductExceptionHandler.name,
        );
        throw error;
    }
  }
}
