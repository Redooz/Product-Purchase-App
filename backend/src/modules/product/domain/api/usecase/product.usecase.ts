import { ProductServicePort } from '../product.service.port';
import { Injectable } from '@nestjs/common';
import { ProductPersistencePort } from '../../spi/product.persistence.port';
import { productSeed } from '../../seed/product.seed';

@Injectable()
export class ProductUsecase extends ProductServicePort {
  constructor(private readonly productPersistencePort: ProductPersistencePort) {
    super();
  }

  override async seedProducts(): Promise<void> {
    const products = await this.productPersistencePort.getProducts();

    if (!products) {
      return await this.productPersistencePort.createProducts(productSeed);
    }

    return Promise.resolve();
  }
}
