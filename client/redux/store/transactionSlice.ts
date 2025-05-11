import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  paidBy: {
    id: string;
    username: string;
  };
  splits: {
    userId: string;
    percent: number;
    value: number;
  }[];
  createdAt: string;
}

interface TransactionState {
  transactions: Transaction[];
  refreshTrigger: number;
}

const initialState: TransactionState = {
  transactions: [],
  refreshTrigger: 0,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(
        (t) => t.id === action.payload.id
      );
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload
      );
    },
    triggerRefresh: (state) => {
      state.refreshTrigger += 1;
    },
  },
});

export const {
  setTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  triggerRefresh,
} = transactionSlice.actions;
export default transactionSlice.reducer;
