import {
  addTransaction,
  removeTransaction,
  selectPendingLocalFinishTransactions
} from '../pendingFinishLocalTransactionsSlice';
import { createListenerMiddleware } from '@reduxjs/toolkit';

const finishLocalTransactionsListenerMiddleware = createListenerMiddleware();

const updateLocalStorage = (listenerApi: any) => {
  const state = listenerApi.getState();
  const pendingFinishLocalTransactions = selectPendingLocalFinishTransactions(state);
  localStorage.setItem('pendingFinishLocalTransactions', JSON.stringify(pendingFinishLocalTransactions));
};

finishLocalTransactionsListenerMiddleware.startListening({
  actionCreator: addTransaction,
  effect: (action, listenerApi) => {
    updateLocalStorage(listenerApi);
  },
});

finishLocalTransactionsListenerMiddleware.startListening({
  actionCreator: removeTransaction,
  effect: (action, listenerApi) => {
    updateLocalStorage(listenerApi);
  },
});

export default finishLocalTransactionsListenerMiddleware;