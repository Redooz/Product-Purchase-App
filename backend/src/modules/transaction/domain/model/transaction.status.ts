import { Status } from '@/transaction/domain/model/enum/status';

export interface TransactionStatus {
  id?: number;
  status: Status;
}
