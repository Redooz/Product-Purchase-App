import { Repository } from 'typeorm';
import { ProductEntity } from '../entity/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  async getProducts(): Promise<ProductEntity[]> {
    return await this.repository.find();
  }

  async createProducts(products: ProductEntity[]): Promise<void> {
    await this.repository.save(products);
  }

  async getProductById(id: number): Promise<ProductEntity> {
    return await this.repository.findOne({ where: { id } });
  }
}
