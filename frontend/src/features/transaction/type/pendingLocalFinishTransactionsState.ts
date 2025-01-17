import { FinishTransactionRequest } from '../dto/request/finishTransactionRequest';

export interface PendingLocalFinishTransactionsState {
  localTransactions: FinishTransactionRequest[];
}