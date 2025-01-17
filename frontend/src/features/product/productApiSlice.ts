import { apiSlice } from '../../app/api/apiSlice';
import { GetProductResponse } from './dto/response/getProductResponse';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query<GetProductResponse[], void>({
      query: () => '/products',
    }),
  }),
});

export const { useGetProductsQuery } = productApiSlice;