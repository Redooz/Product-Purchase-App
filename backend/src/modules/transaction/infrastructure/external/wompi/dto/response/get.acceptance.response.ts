  export interface GetAcceptanceResponse {
  data: {
    id: number;
    name: string;
    email: string;
    contact_name: string;
    phone_number: string;
    active: boolean;
    logo_url: string | null;
    legal_name: string;
    legal_id_type: string;
    legal_id: string;
    public_key: string;
    accepted_currencies: string[];
    fraud_javascript_key: string | null;
    fraud_groups: any[];
    accepted_payment_methods: string[];
    payment_methods: {
      name: string;
      payment_processors: {
        name: string;
      }[];
    }[];
    presigned_acceptance: {
      acceptance_token: string;
      permalink: string;
      type: string;
    };
    presigned_personal_data_auth: {
      acceptance_token: string;
      permalink: string;
      type: string;
    };
  };
  meta: any;
}