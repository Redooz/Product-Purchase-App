import { PendingLocalFinishTransactionsState } from './type/pendingLocalFinishTransactionsState';
import { createSlice } from '@reduxjs/toolkit';
import { FinishTransactionRequest } from './dto/request/finishTransactionRequest';

const initialState: PendingLocalFinishTransactionsState = {
  localTransactions: JSON.parse(
    localStorage.getItem('pendingFinishLocalTransactions') || '[]',
  ),
}

const pendingLocalFinishTransactionsSlice = createSlice({
  name: 'pendingFinishLocalTransactions',
  initialState: initialState,
  reducers: {
    addTransaction(
      state: PendingLocalFinishTransactionsState,
      action: { payload: FinishTransactionRequest },
    ) {
      const { payload } = action;

      const existingTransaction = state.localTransactions.find(
        transaction => transaction.transactionId === payload.transactionId,
      );

      if (!existingTransaction) {
        state.localTransactions.push(payload);
      } else {
        state.localTransactions = state.localTransactions.map(transaction =>
          transaction.transactionId === payload.transactionId ? payload : transaction,
        );
      }
    },
    removeTransaction(
      state: PendingLocalFinishTransactionsState,
      action: { payload: number },
    ) {
      const { payload } = action;
      state.localTransactions = state.localTransactions.filter(
        transaction => transaction.transactionId !== payload,
      );
    },
  },
});

export const { addTransaction, removeTransaction } =
  pendingLocalFinishTransactionsSlice.actions;

export default pendingLocalFinishTransactionsSlice.reducer;

export const selectPendingLocalFinishTransactions = (state: {
  pendingFinishLocalTransactions: PendingLocalFinishTransactionsState;
}) => state.pendingFinishLocalTransactions.localTransactions;