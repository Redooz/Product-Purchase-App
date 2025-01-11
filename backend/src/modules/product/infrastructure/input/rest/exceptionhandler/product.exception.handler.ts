import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProductNotFoundError } from '../../../../domain/exception/product.not.found.error';

@Injectable()
export class ProductExceptionHandler {
  handleGetProducts(error: Error): void {
    if (error instanceof ProductNotFoundError) {
      throw new NotFoundException(error.message);
    }
    Logger.error('Unexpected error', error.stack, ProductExceptionHandler.name);
    throw error;
  }
}
