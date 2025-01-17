import { Injectable } from '@nestjs/common';
import { ProductServicePort } from '../../domain/api/product.service.port';
import { GetProductResponse } from '../dto/response/get.product.response';

@Injectable()
export class ProductHandler {
  constructor(private readonly productServicePort: ProductServicePort) {}

  async getProducts(): Promise<GetProductResponse[]> {
    const products = await this.productServicePort.getProducts();
    return products.map(
      (product): GetProductResponse => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        image: product.image,
        description: product.description,
      }),
    );
  }

  async seedProducts(): Promise<void> {
    return await this.productServicePort.seedProducts();
  }
}
