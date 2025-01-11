import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductHandler } from '@/product/application/handler/product.handler';
import { GetProductResponse } from '@/product/application/dto/response/get.product.response';
import { ProductExceptionHandler } from '../exceptionhandler/product.exception.handler';
import { JwtAuthGuard } from '@/auth/infrastructure/external/guard/jwt.guard';

@ApiTags('products')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(
    private readonly handler: ProductHandler,
    private readonly exceptionHandler: ProductExceptionHandler,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Return all products',
    type: [GetProductResponse],
  })
  @ApiResponse({ status: 404, description: 'Products not found' })
  async getProducts(): Promise<GetProductResponse[]> {
    try {
      return await this.handler.getProducts();
    } catch (error) {
      this.exceptionHandler.handleGetProducts(error);
    }
  }
}
