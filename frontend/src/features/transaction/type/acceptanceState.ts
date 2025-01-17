interface Acceptance {
  acceptanceToken: string;
  permalink: string;
  type: 'END_USER_POLICY' | 'PERSONAL_DATA_AUTH';
}

export interface AcceptanceState {
  endUserPolicy: Acceptance;
  personalDataAuthorization: Acceptance;
}