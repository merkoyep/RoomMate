import { createSlice } from '@reduxjs/toolkit';
import { CREATE_TRANSACTION } from '../../../graphql/mutations';
import { useMutation } from '@apollo/client';
const initialState = {
  step: 0,
};

const createTransactionSlice = createSlice({
  name: 'createTransaction',
  initialState,
  reducers: {
    nextStep: (state) => {
      state.step += 1;
    },
    prevStep: (state) => {
      state.step -= 1;
    },
    resetStep: (state) => {
      state.step = 0;
    },
  },
});

export const { nextStep, prevStep, resetStep } = createTransactionSlice.actions;
export default createTransactionSlice.reducer;
