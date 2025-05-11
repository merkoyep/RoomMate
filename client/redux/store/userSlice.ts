import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  username: string;
  email: string;
}

interface UserState {
  currentUser: User | null;
  token: string | null;
}

const initialState: UserState = {
  currentUser: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.token = null;
    },
  },
});

export const { setUser, setToken, clearUser } = userSlice.actions;
export default userSlice.reducer;
