export class ProductQuantityNotAvailableError extends Error {
  constructor() {
    super('Product quantity not available');
    this.name = 'ProductQuantityNotAvailableError';
  }
}