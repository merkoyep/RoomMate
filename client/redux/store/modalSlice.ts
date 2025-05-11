import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
  modalType: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (state, action) => {
      state.isModalOpen = true;
      state.modalType = action.payload;
    },
    hideModal: (state) => {
      state.isModalOpen = false;
      state.modalType = null;
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
