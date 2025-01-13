export interface Delivery {
  id?: number;
  personName: string;
  address: string;
  country: string;
  city: string;
  region: string;
  postalCode: string;
  phoneNumber: string;
  fee?: number;
}
