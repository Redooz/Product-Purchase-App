import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from '../features/auth/authSlice';
import authListenerMiddleware from '../features/auth/middleware/authListenerMiddleware';
import pendingLocalTransactionsReducer from '../features/transaction/pendingLocalTransactionsSlice';
import localTransactionsListenerMiddleware from '../features/transaction/middleware/localTransactionsListenerMiddleware';
import acceptanceReducer from '../features/transaction/acceptanceSlice';
import acceptanceListenerMiddleware from '../features/transaction/middleware/acceptanceListenerMiddleware';
import pendingFinishLocalTransactionsReducer from '../features/transaction/pendingFinishLocalTransactionsSlice';
import finishLocalTransactionsListenerMiddleware from '../features/transaction/middleware/finishLocalTransactionsListenerMiddleware';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    pendingLocalTransactions: pendingLocalTransactionsReducer,
    pendingFinishLocalTransactions: pendingFinishLocalTransactionsReducer,
    acceptance: acceptanceReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      authListenerMiddleware.middleware,
      localTransactionsListenerMiddleware.middleware,
      acceptanceListenerMiddleware.middleware,
      finishLocalTransactionsListenerMiddleware.middleware
    ),
  devTools: true,
});
