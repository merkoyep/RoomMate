import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Split {
  percent: string;
  value: string;
}

interface SplitState {
  splits: { [userId: string]: Split };
}

const initialState: SplitState = {
  splits: {},
};

const splitSlice = createSlice({
  name: 'splits',
  initialState,
  reducers: {
    setSplit: (
      state,
      action: PayloadAction<{ userId: string; split: Split }>
    ) => {
      state.splits[action.payload.userId] = action.payload.split;
    },
    setSplits: (state, action: PayloadAction<{ [userId: string]: Split }>) => {
      state.splits = action.payload;
    },
    clearSplits: (state) => {
      state.splits = {};
    },
  },
});

export const { setSplit, setSplits, clearSplits } = splitSlice.actions;
export default splitSlice.reducer;
