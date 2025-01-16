import { createListenerMiddleware } from '@reduxjs/toolkit';
import { addTransaction, removeTransaction, selectPendingLocalTransactions } from '../pendingLocalTransactionsSlice';

const localTransactionsListenerMiddleware = createListenerMiddleware();

const updateLocalStorage = (listenerApi: any) => {
  const state = listenerApi.getState();
  const pendingLocalTransactions = selectPendingLocalTransactions(state);
  localStorage.setItem('pendingLocalTransactions', JSON.stringify(pendingLocalTransactions));
};

localTransactionsListenerMiddleware.startListening({
  actionCreator: addTransaction,
  effect: (action, listenerApi) => {
    updateLocalStorage(listenerApi);
  },
});

localTransactionsListenerMiddleware.startListening({
  actionCreator: removeTransaction,
  effect: (action, listenerApi) => {
    updateLocalStorage(listenerApi);
  },
});

export default localTransactionsListenerMiddleware;