import { apiSlice } from '../../app/api/apiSlice';
import { GetTransactionResponse } from './dto/response/getTransactionResponse';
import { StartTransactionResponse } from './dto/response/startTransactionResponse';
import { StartTransactionRequest } from './dto/request/startTransactionRequest';
import { FinishTransactionRequest } from './dto/request/finishTransactionRequest';
import { FinishTransactionResponse } from './dto/response/finishTransactionResponse';

export const transactionApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPendingTransactions: builder.query<GetTransactionResponse[], void>({
      query: () => '/transactions/pending',
    }),
    startTransaction: builder.mutation<
      StartTransactionResponse,
      StartTransactionRequest
    >({
      query: (request: StartTransactionRequest) => ({
        url: '/transactions',
        method: 'POST',
        body: request,
      }),
    }),
    deleteTransaction: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `/transactions/${id}`,
        method: 'DELETE',
      }),
    }),
    finishTransaction: builder.mutation<FinishTransactionResponse, FinishTransactionRequest>({
      query: (request: FinishTransactionRequest) => ({
        url: '/transactions/finish',
        method: 'POST',
        body: request,
      }),
    }),
    getTransactionDetails: builder.query<FinishTransactionResponse, number>({
      query: (id: number) => `/transactions/${id}`,
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetPendingTransactionsQuery,
  useStartTransactionMutation,
  useDeleteTransactionMutation,
  useFinishTransactionMutation,
  useGetTransactionDetailsQuery,
} = transactionApiSlice;
