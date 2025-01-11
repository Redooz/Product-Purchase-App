import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository } from './product.repository';
import { ProductEntity } from '../entity/product.entity';

describe('ProductRepository', () => {
  let productRepository: ProductRepository;
  let repository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: getRepositoryToken(ProductEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    productRepository = module.get<ProductRepository>(ProductRepository);
    repository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  it('should return all products', async () => {
    const products = [new ProductEntity(), new ProductEntity()];
    jest.spyOn(repository, 'find').mockResolvedValue(products);

    const result = await productRepository.getProducts();

    expect(result).toEqual(products);
  });

  it('should save products', async () => {
    const products = [new ProductEntity(), new ProductEntity()];
    jest.spyOn(repository, 'save').mockResolvedValue(undefined);

    await productRepository.createProducts(products);

    expect(repository.save).toHaveBeenCalledWith(products);
  });
});
