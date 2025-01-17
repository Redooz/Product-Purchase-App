import { createSlice } from '@reduxjs/toolkit';
import { AcceptanceState } from './type/acceptanceState';

const initialState: AcceptanceState = JSON.parse(
  localStorage.getItem('acceptance') || '{}',
);

const acceptanceSlice = createSlice({
  name: 'acceptance',
  initialState: initialState,
  reducers: {
    setAcceptance(
      state: AcceptanceState,
      action: { payload: AcceptanceState },
    ) {
      const { payload } = action;
      state.endUserPolicy = payload.endUserPolicy;
      state.personalDataAuthorization = payload.personalDataAuthorization;
    },
    removeAcceptance(state: AcceptanceState) {
      state = {
        endUserPolicy: {
          acceptanceToken: '',
          permalink: '',
          type: 'END_USER_POLICY',
        },
        personalDataAuthorization: {
          acceptanceToken: '',
          permalink: '',
          type: 'PERSONAL_DATA_AUTH',
        },
      };
    },
  },
});

export const { setAcceptance, removeAcceptance } = acceptanceSlice.actions;

export default acceptanceSlice.reducer;

export const selectAcceptance = (state: { acceptance: AcceptanceState }) =>
  state.acceptance;
