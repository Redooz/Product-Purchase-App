import { Acceptance } from '@/transaction/domain/model/acceptance';

export abstract class AcceptanceServicePort {
  abstract getAllPresignedAcceptances(): Promise<Acceptance[]>;
}
