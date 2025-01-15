import { StartTransactionRequest } from '../dto/request/startTransactionRequest';

export interface PendingLocalTransactionsState {
  localTransactions: StartTransactionRequest[];
}