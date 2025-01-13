import { Test, TestingModule } from '@nestjs/testing';
import { ProductPersistenceAdapter } from './product.persistence.adapter';
import { ProductRepository } from '../repository/product.repository';
import { Product } from '@/product/domain/model/product';
import { ProductEntity } from '../entity/product.entity';

describe('ProductPersistenceAdapter', () => {
  let productPersistenceAdapter: ProductPersistenceAdapter;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductPersistenceAdapter,
        {
          provide: ProductRepository,
          useValue: {
            createProducts: jest.fn(),
            getProducts: jest.fn(),
            getProductById: jest.fn(),
            updateProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    productPersistenceAdapter = module.get<ProductPersistenceAdapter>(
      ProductPersistenceAdapter,
    );
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  it('should create products successfully', async () => {
    // Arrange
    const products: Product[] = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        stock: 10,
        image: 'image1.jpg',
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Description 2',
        price: 200,
        stock: 20,
        image: 'image2.jpg',
      },
    ];
    const productEntities: ProductEntity[] = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image,
    }));

    // Act
    await productPersistenceAdapter.createProducts(products);

    // Assert
    expect(productRepository.createProducts).toHaveBeenCalledWith(
      productEntities,
    );
  });

  it('should return products when products exist', async () => {
    // Arrange
    const productEntities: ProductEntity[] = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        stock: 10,
        image: 'image1.jpg',
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Description 2',
        price: 200,
        stock: 20,
        image: 'image2.jpg',
      },
    ];
    const products: Product[] = productEntities.map((entity) => ({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      stock: entity.stock,
      image: entity.image,
    }));
    jest
      .spyOn(productRepository, 'getProducts')
      .mockResolvedValue(productEntities);

    // Act
    const result = await productPersistenceAdapter.getProducts();

    // Assert
    expect(result).toEqual(products);
  });

  it('should return null when no products exist', async () => {
    // Arrange
    jest.spyOn(productRepository, 'getProducts').mockResolvedValue([]);

    // Act
    const result = await productPersistenceAdapter.getProducts();

    // Assert
    expect(result).toBeNull();
  });

  it('should return product when product exists', async () => {
    // Arrange
    const productEntity: ProductEntity = {
      id: 1,
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      stock: 10,
      image: 'image1.jpg',
    };
    const product: Product = {
      id: productEntity.id,
      name: productEntity.name,
      description: productEntity.description,
      price: productEntity.price,
      stock: productEntity.stock,
      image: productEntity.image,
    };
    jest
      .spyOn(productRepository, 'getProductById')
      .mockResolvedValue(productEntity);

    // Act
    const result = await productPersistenceAdapter.getProductById(1);

    // Assert
    expect(result).toEqual(product);
  });

  it('should return null when product does not exist', async () => {
    // Arrange
    jest.spyOn(productRepository, 'getProductById').mockResolvedValue(null);

    // Act
    const result = await productPersistenceAdapter.getProductById(1);

    // Assert
    expect(result).toBeNull();
  });

  it('should update product successfully', async () => {
    // Arrange
    const product: Product = {
      id: 1,
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      stock: 10,
      image: 'image1.jpg',
    };
    const productEntity: ProductEntity = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image,
    };

    // Act
    await productPersistenceAdapter.updateProduct(1, product);

    // Assert
    expect(productRepository.updateProduct).toHaveBeenCalledWith(
      1,
      productEntity,
    );
  });
});
