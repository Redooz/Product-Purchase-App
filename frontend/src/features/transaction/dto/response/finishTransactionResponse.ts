export interface FinishTransactionResponse {
  id: number;
  total: number;
  status: string;
  deliveryFee: number;
  product: {
    name: string;
    quantity: number;
  };
}