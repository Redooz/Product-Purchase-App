import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from '../features/auth/authSlice';
import authListenerMiddleware from '../features/auth/middleware/authListenerMiddleware';
import pendingLocalTransactionsReducer from '../features/transaction/pendingLocalTransactionsSlice';
import localTransactionsListenerMiddleware from '../features/transaction/middleware/localTransactionsListenerMiddleware';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    pendingLocalTransactions: pendingLocalTransactionsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      authListenerMiddleware.middleware,
      localTransactionsListenerMiddleware.middleware,
    ),
  devTools: true,
});
