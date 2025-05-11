import { createSlice } from '@reduxjs/toolkit';

export interface TransactionFormSliceState {
  title: string;
  amount: number;
  type: string;
  category: string;
  paidBy: string;
  split: number[];
  description: string;
  createdAt: string;
}

const initialState: TransactionFormSliceState = {
  title: '',
  amount: 0,
  type: '',
  category: '',
  paidBy: '',
  split: [],
  description: '',
  createdAt: '',
};

const transactionFormSlice = createSlice({
  name: 'transactionForm',
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setPaidBy: (state, action) => {
      state.paidBy = action.payload;
    },
    setSplit: (state, action) => {
      state.split = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setCreatedAt: (state, action) => {
      state.createdAt = action.payload;
    },
  },
});

export const { setTitle } = transactionFormSlice.actions;
export default transactionFormSlice.reducer;
