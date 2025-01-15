import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState } from './type/authState'

const initialState: AuthState = { token: localStorage.getItem('token') };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state: AuthState,
      action: PayloadAction<{ token: string }>,
    ) {
      const { token } = action.payload
      state.token = token
      
    },
    logout(state: AuthState) {
      state.token = null
    },
  },
})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer

export const selectedCurrentToken = (state: { auth: AuthState }) =>
  state.auth.token
