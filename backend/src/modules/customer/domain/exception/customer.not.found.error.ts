export class CustomerNotFoundError extends Error {
  constructor(id: number) {
    super(`Customer with id ${id} not found`);
    this.name = 'CustomerNotFoundError';
  }
}