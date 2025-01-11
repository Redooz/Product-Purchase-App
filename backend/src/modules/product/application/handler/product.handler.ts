import { Injectable } from '@nestjs/common';
import { ProductServicePort } from '../../domain/api/product.service.port';

@Injectable()
export class ProductHandler {
  constructor(private readonly productServicePort: ProductServicePort) {}

  async seedProducts(): Promise<void> {
    return await this.productServicePort.seedProducts();
  }
}
