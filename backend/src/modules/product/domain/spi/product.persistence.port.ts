import { Product } from '../model/product';

export abstract class ProductPersistencePort {
  abstract getProducts(): Promise<Product[] | null>;
  abstract createProducts(products: Product[]): Promise<void>;
}
