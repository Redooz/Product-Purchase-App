import { BaseQueryApi, fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'
import { logout } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000',
  prepareHeaders: (headers, { getState }: any) => {
    const token = getState().auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithLogout = async (
  args: any,
  api: BaseQueryApi,
  extraOptions: any,
) => {
  const result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    api.dispatch(logout())
  }
  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithLogout,
  endpoints: builder => ({}),
})
