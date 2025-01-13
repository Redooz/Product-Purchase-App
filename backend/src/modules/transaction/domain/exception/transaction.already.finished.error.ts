export class TransactionAlreadyFinishedError extends Error {
  constructor(id: number) {
    super(`Transaction with id ${id} is already finished`);
  }
}
