import { createSlice } from '@reduxjs/toolkit';
import { StartTransactionRequest } from './dto/request/startTransactionRequest';
import { PendingLocalTransactionsState } from './type/pendingLocalTransactionsState';

const initialState: PendingLocalTransactionsState = {
  localTransactions: JSON.parse(
    localStorage.getItem('pendingLocalTransactions') || '[]',
  ),
};

const pendingLocalTransactionsSlice = createSlice({
  name: 'pendingLocalTransactions',
  initialState: initialState,
  reducers: {
    addTransaction(
      state: PendingLocalTransactionsState,
      action: { payload: StartTransactionRequest },
    ) {
      const { payload } = action;

      const existingTransaction = state.localTransactions.find(
        transaction => transaction.productId === payload.productId,
      );

      if (!existingTransaction) {
        state.localTransactions.push(payload);
      } else {
        state.localTransactions = state.localTransactions.map(transaction =>
          transaction.productId === payload.productId ? payload : transaction,
        );
      }
    },
    removeTransaction(
      state: PendingLocalTransactionsState,
      action: { payload: number },
    ) {
      const { payload } = action;
      state.localTransactions = state.localTransactions.filter(
        transaction => transaction.productId !== payload,
      );
    },
  },
});

export const { addTransaction, removeTransaction } =
  pendingLocalTransactionsSlice.actions;

export default pendingLocalTransactionsSlice.reducer;

export const selectPendingLocalTransactions = (state: {
  pendingLocalTransactions: PendingLocalTransactionsState;
}) => state.pendingLocalTransactions.localTransactions;