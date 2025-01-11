import { Controller, Get } from '@nestjs/common';
import { ProductHandler } from '../../../../application/handler/product.handler';
import { GetProductResponse } from '../../../../application/dto/response/get.product.response';
import { ProductExceptionHandler } from '../exceptionhandler/product.exception.handler';

@Controller('products')
export class ProductController {
  constructor(
    private readonly handler: ProductHandler,
    private readonly exceptionHandler: ProductExceptionHandler,
  ) {}

  @Get()
  async getProducts(): Promise<GetProductResponse[]> {
    try {
      return await this.handler.getProducts();
    } catch (error) {
      this.exceptionHandler.handleGetProducts(error);
    }
  }
}
