import { apiSlice } from '../../app/api/apiSlice';
import { LoginRequest } from './dto/request/loginRequest';
import { SignupRequest } from './dto/request/signupRequest';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: LoginRequest) =>  ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials: SignupRequest) => ({
        url: '/auth/signup',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApiSlice;
