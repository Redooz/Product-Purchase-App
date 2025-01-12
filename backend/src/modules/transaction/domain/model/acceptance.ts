import { AcceptanceType } from '@/transaction/domain/model/enum/acceptance.type';

export interface Acceptance {
  acceptanceToken: string;
  permalink?: string;
  type: AcceptanceType;
}
