import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modalSlice';
import createTransactionReducer from './createTransactionSlice';
import transactionFormReducer from './transactionFormSlice';
import userReducer from './userSlice';
import splitReducer from './splitSlice';

const store = configureStore({
  reducer: {
    modal: modalReducer,
    createTransaction: createTransactionReducer,
    transactionForm: transactionFormReducer,
    user: userReducer,
    splits: splitReducer,
  },
});

export default store;
