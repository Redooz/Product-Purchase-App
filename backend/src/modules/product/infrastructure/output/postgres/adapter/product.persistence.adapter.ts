import { ProductPersistencePort } from '@/product/domain/spi/product.persistence.port';
import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import { Product } from '@/product/domain/model/product';
import { ProductEntity } from '../entity/product.entity';

@Injectable()
export class ProductPersistenceAdapter extends ProductPersistencePort {
  constructor(private readonly repository: ProductRepository) {
    super();
  }

  override async createProducts(products: Product[]): Promise<void> {
    const productEntities = products.map((product): ProductEntity => {
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.image,
      };
    });

    return await this.repository.createProducts(productEntities);
  }

  override async getProducts(): Promise<Product[] | null> {
    const productEntities = await this.repository.getProducts();

    if (productEntities.length === 0) {
      return null;
    }

    return productEntities.map((productEntity): Product => {
      return {
        id: productEntity.id,
        name: productEntity.name,
        description: productEntity.description,
        price: productEntity.price,
        stock: productEntity.stock,
        image: productEntity.image,
      };
    });
  }
}
