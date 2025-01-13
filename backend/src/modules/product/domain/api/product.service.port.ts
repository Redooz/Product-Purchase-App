import { Product } from '../model/product';

export abstract class ProductServicePort {
  abstract getProducts(): Promise<Product[]>;

  abstract getProductById(id: number): Promise<Product>;

  abstract updateProductStock(
    productId: number,
    quantity: number,
  ): Promise<void>;

  abstract seedProducts(): Promise<void>;
}
