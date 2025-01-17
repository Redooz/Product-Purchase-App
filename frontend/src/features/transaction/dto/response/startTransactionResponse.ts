export interface StartTransactionResponse {
  id: number;
  total: number;
  status: string;
  deliveryFee: number;
  endUserPolicy?: {
    acceptanceToken: string;
    permalink: string;
    type: string;
  };
  personalDataAuthorization?: {
    acceptanceToken: string;
    permalink: string;
    type: string;
  };
}