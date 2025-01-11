export abstract class ProductServicePort {
  abstract seedProducts(): Promise<void>;
}
