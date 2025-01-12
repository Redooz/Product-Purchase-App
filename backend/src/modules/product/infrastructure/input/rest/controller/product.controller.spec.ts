import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductExceptionHandler } from '../exceptionhandler/product.exception.handler';
import { GetProductResponse } from '@/product/application/dto/response/get.product.response';
import { generateProducts } from '@/product/domain/seed/product.seed';
import { ProductHandler } from '@/product/application/handler/product.handler';

describe('ProductController', () => {
  let productController: ProductController;
  let productHandler: ProductHandler;
  let productExceptionHandler: ProductExceptionHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductHandler,
          useValue: {
            getProducts: jest.fn(),
          },
        },
        {
          provide: ProductExceptionHandler,
          useValue: {
            handleGetProducts: jest.fn(),
          },
        },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productHandler = module.get<ProductHandler>(ProductHandler);
    productExceptionHandler = module.get<ProductExceptionHandler>(
      ProductExceptionHandler,
    );
  });

  it('should return products when products exist', async () => {
    // Arrange
    const products = generateProducts(5);
    const productsResponse = products.map(
      (product): GetProductResponse => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        image: product.image,
        description: product.description,
      }),
    );
    jest
      .spyOn(productHandler, 'getProducts')
      .mockResolvedValue(productsResponse);

    // Act
    const result = await productController.getProducts();

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

  it('should handle exception when an error occurs', async () => {
    // Arrange
    const error = new Error('Test error');
    jest.spyOn(productHandler, 'getProducts').mockRejectedValue(error);
    jest
      .spyOn(productExceptionHandler, 'handleGetProducts')
      .mockImplementation(() => {});

    // Act
    await productController.getProducts();

    // Assert
    expect(productExceptionHandler.handleGetProducts).toHaveBeenCalledWith(
      error,
    );
  });
});
