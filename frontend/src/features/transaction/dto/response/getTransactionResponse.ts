export interface GetTransactionResponse {
  id: number;
  quantity: number;
  total: string;
  delivery: {
    id: number;
    personName: string;
    address: string;
    country: string;
    city: string;
    postalCode: string;
  };
  product: {
    id: number;
    name: string;
    price: string;
  };
  status: {
    id: number;
    name: string;
  };
}