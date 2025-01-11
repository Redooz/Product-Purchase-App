import { Product } from '../model/product';

export abstract class ProductServicePort {
  abstract getProducts(): Promise<Product[]>;
  abstract getProductById(id: number): Promise<Product>;
  abstract seedProducts(): Promise<void>;
}
