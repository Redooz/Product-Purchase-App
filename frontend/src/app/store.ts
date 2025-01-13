import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from '../features/auth/authSlice';
import authListenerMiddleware from '../features/auth/middleware/authListenerMiddleware';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      authListenerMiddleware.middleware,
    ),
  devTools: true,
});
