import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../../components/Transactions/CreateTransaction/CreateTransactionFormComponent';

interface ModalState {
  isModalOpen: boolean;
  modalType: 'createTransaction' | 'readTransaction' | null;
  selectedTransaction: Transaction | null;
}

const initialState: ModalState = {
  isModalOpen: false,
  modalType: null,
  selectedTransaction: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (
      state,
      action: PayloadAction<{
        type: 'createTransaction' | 'readTransaction';
        selectedTransaction?: Transaction;
      }>
    ) => {
      state.isModalOpen = true;
      state.modalType = action.payload.type;
      if (action.payload.selectedTransaction) {
        state.selectedTransaction = action.payload.selectedTransaction;
      }
    },
    hideModal: (state) => {
      state.isModalOpen = false;
      state.modalType = null;
      state.selectedTransaction = null;
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
