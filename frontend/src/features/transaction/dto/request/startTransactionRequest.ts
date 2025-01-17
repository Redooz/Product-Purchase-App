export interface StartTransactionRequest {
  quantity?: number;
  productId: number;
  deliveryInfo?: {
    personName?: string;
    address?: string;
    country?: string;
    region?: string;
    city?: string;
    postalCode?: string;
    phoneNumber?: string;
  };
}