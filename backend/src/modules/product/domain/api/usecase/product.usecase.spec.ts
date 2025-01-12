import { Test, TestingModule } from '@nestjs/testing';
import { ProductUsecase } from './product.usecase';
import { ProductPersistencePort } from '../../spi/product.persistence.port';
import { ProductNotFoundError } from '../../exception/product.not.found.error';
import { ExceptionConstant } from '../../constant/exception.constant';
import { generateProducts, productSeed } from '../../seed/product.seed';
import { Product } from '../../model/product';

describe('ProductUsecase', () => {
  let productUsecase: ProductUsecase;
  let productPersistencePort: ProductPersistencePort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductUsecase,
        {
          provide: ProductPersistencePort,
          useValue: {
            getProducts: jest.fn(),
            createProducts: jest.fn(),
            getProductById: jest.fn(),
          },
        },
      ],
    }).compile();

    productUsecase = module.get<ProductUsecase>(ProductUsecase);
    productPersistencePort = module.get<ProductPersistencePort>(
      ProductPersistencePort,
    );
  });

  it('should return products when products exist', async () => {
    // Arrange
    const products: Product[] = generateProducts(5);
    jest
      .spyOn(productPersistencePort, 'getProducts')
      .mockResolvedValue(products);

    // Act
    const result = await productUsecase.getProducts();

    // Assert
    expect(result).toEqual(products);
  });

  it('should throw ProductNotFoundError when no products exist', async () => {
    // Arrange
    jest.spyOn(productPersistencePort, 'getProducts').mockResolvedValue(null);

    // Act & Assert
    await expect(productUsecase.getProducts()).rejects.toThrow(
      ProductNotFoundError,
    );
    await expect(productUsecase.getProducts()).rejects.toThrow(
      ExceptionConstant.PRODUCTS_NOT_FOUND_MESSAGE,
    );
  });

  it('should seed products when no products exist', async () => {
    // Arrange
    jest.spyOn(productPersistencePort, 'getProducts').mockResolvedValue(null);
    jest.spyOn(productPersistencePort, 'createProducts').mockResolvedValue();

    // Act
    await productUsecase.seedProducts();

    // Assert
    expect(productPersistencePort.createProducts).toHaveBeenCalledWith(
      productSeed,
    );
  });

  it('should not seed products when products already exist', async () => {
    // Arrange
    const products: Product[] = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 10,
        stock: 5,
        image: 'image1.jpg',
      },
    ];
    jest
      .spyOn(productPersistencePort, 'getProducts')
      .mockResolvedValue(products);

    // Act
    await productUsecase.seedProducts();

    // Assert
    expect(productPersistencePort.createProducts).not.toHaveBeenCalled();
  });

  it('should return product when product exists', async () => {
    // Arrange
    const product: Product = {
      id: 1,
      name: 'Product 1',
      description: 'Description 1',
      price: 10,
      stock: 5,
      image: 'image1.jpg',
    };
    jest
      .spyOn(productPersistencePort, 'getProductById')
      .mockResolvedValue(product);

    // Act
    const result = await productUsecase.getProductById(1);

    // Assert
    expect(result).toEqual(product);
  });

  it('should throw ProductNotFoundError when product does not exist', async () => {
    // Arrange
    const id = 1;
    jest
      .spyOn(productPersistencePort, 'getProductById')
      .mockResolvedValue(null);

    // Act & Assert
    await expect(productUsecase.getProductById(id)).rejects.toThrow(
      ProductNotFoundError,
    );
    await expect(productUsecase.getProductById(id)).rejects.toThrow(
      ExceptionConstant.PRODUCT_NOT_FOUND_MESSAGE.replace(
        '{id}',
        id.toString(),
      ),
    );
  });
});
