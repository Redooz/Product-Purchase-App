import { Test, TestingModule } from '@nestjs/testing';
import { ProductHandler } from './product.handler';
import { ProductServicePort } from '../../domain/api/product.service.port';
import { GetProductResponse } from '../dto/response/get.product.response';
import { generateProducts } from '../../domain/seed/product.seed';

describe('ProductHandler', () => {
  let productHandler: ProductHandler;
  let productServicePort: ProductServicePort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductHandler,
        {
          provide: ProductServicePort,
          useValue: {
            getProducts: jest.fn(),
            seedProducts: jest.fn(),
          },
        },
      ],
    }).compile();

    productHandler = module.get<ProductHandler>(ProductHandler);
    productServicePort = module.get<ProductServicePort>(ProductServicePort);
  });

  it('should return products when products exist', async () => {
    // Arrange
    const products = generateProducts(5);
    jest.spyOn(productServicePort, 'getProducts').mockResolvedValue(products);

    // Act
    const result = await productHandler.getProducts();

    // Assert
    expect(result).toEqual(
      products.map(
        (product): GetProductResponse => ({
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          image: product.image,
          description: product.description,
        }),
      ),
    );
  });

  it('should seed products successfully', async () => {
    // Arrange
    jest.spyOn(productServicePort, 'seedProducts').mockResolvedValue();

    // Act
    await productHandler.seedProducts();

    // Assert
    expect(productServicePort.seedProducts).toHaveBeenCalled();
  });
});
