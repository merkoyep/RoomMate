import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Split {
  percent: string;
  value: string;
}

export interface TransactionFormSliceState {
  title: string;
  amount: string;
  type: string;
  category: string;
  paidBy: string;
  splits: { [userId: string]: Split };
  description: string;
  createdAt: string;
}

const initialState: TransactionFormSliceState = {
  title: '',
  amount: '',
  type: '',
  category: '',
  paidBy: '',
  splits: {},
  description: '',
  createdAt: '',
};

const transactionFormSlice = createSlice({
  name: 'transactionForm',
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{
        field: keyof TransactionFormSliceState;
        value: string | number | string[];
      }>
    ) => {
      (state as any)[action.payload.field] = action.payload.value;
    },
    setSplit: (
      state,
      action: PayloadAction<{
        userId: string;
        split: Split;
      }>
    ) => {
      state.splits[action.payload.userId] = action.payload.split;
    },
    clearTransactionForm: () => {
      return initialState;
    },
  },
});

export const { setField, setSplit, clearTransactionForm } =
  transactionFormSlice.actions;
export default transactionFormSlice.reducer;
