export interface FinishTransactionRequest {
  transactionId?: number;
  card: {
    number: string;
    cvc: string;
    expMonth: string;
    expYear: string;
    cardHolder: string;
  };
}