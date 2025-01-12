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
    // Arrange
    const products = [new ProductEntity(), new ProductEntity()];
    jest.spyOn(repository, 'find').mockResolvedValue(products);

    // Act
    const result = await productRepository.getProducts();

    // Assert
    expect(result).toEqual(products);
  });

  it('should save products', async () => {
    // Arrange
    const products = [new ProductEntity(), new ProductEntity()];
    jest.spyOn(repository, 'save').mockResolvedValue(undefined);

    // Act
    await productRepository.createProducts(products);

    // Assert
    expect(repository.save).toHaveBeenCalledWith(products);
  });

  it('should return a product by id', async () => {
    // Arrange
    const product = new ProductEntity();
    jest.spyOn(repository, 'findOne').mockResolvedValue(product);

    // Act
    const result = await productRepository.getProductById(1);

    // Assert
    expect(result).toEqual(product);
  });
});
