import { apiSlice } from '../../app/api/apiSlice';
import { GetTransactionResponse } from './dto/response/getTransactionResponse';
import { StartTransactionResponse } from './dto/response/startTransactionResponse';
import { StartTransactionRequest } from './dto/request/startTransactionRequest';

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
  }),
});

export const {
  useGetPendingTransactionsQuery,
  useStartTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApiSlice;
