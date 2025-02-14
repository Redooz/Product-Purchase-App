import { ProductServicePort } from '../product.service.port';
import { Injectable } from '@nestjs/common';
import { ProductPersistencePort } from '../../spi/product.persistence.port';
import { productSeed } from '../../seed/product.seed';
import { Product } from '../../model/product';
import { ProductNotFoundError } from '../../exception/product.not.found.error';
import { ExceptionConstant } from '../../constant/exception.constant';

@Injectable()
export class ProductUsecase extends ProductServicePort {
  constructor(private readonly productPersistencePort: ProductPersistencePort) {
    super();
  }

  override async updateProductStock(
    productId: number,
    quantity: number,
  ): Promise<void> {
    const product = await this.productPersistencePort.getProductById(productId);

    if (!product) {
      throw new ProductNotFoundError(
        ExceptionConstant.PRODUCT_NOT_FOUND_MESSAGE.replace(
          '{id}',
          productId.toString(),
        ),
      );
    }

    product.stock = product.stock - quantity;

    await this.productPersistencePort.updateProduct(productId, product);
  }

  override async getProducts(): Promise<Product[]> {
    const products = await this.productPersistencePort.getProducts();

    if (!products) {
      throw new ProductNotFoundError(
        ExceptionConstant.PRODUCTS_NOT_FOUND_MESSAGE,
      );
    }

    return products;
  }

  override async seedProducts(): Promise<void> {
    const products = await this.productPersistencePort.getProducts();

    if (!products) {
      return await this.productPersistencePort.createProducts(productSeed);
    }

    return Promise.resolve();
  }

  override async getProductById(id: number): Promise<Product> {
    const product = await this.productPersistencePort.getProductById(id);

    if (!product) {
      throw new ProductNotFoundError(
        ExceptionConstant.PRODUCT_NOT_FOUND_MESSAGE.replace(
          '{id}',
          id.toString(),
        ),
      );
    }

    return product;
  }
}
