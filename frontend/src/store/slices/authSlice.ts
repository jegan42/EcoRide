// frontend/src/store/slices/AuthSlices.ts
import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../../types/user';

export interface AuthState {
  user: Partial<User> | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signin(state: typeof initialState, action: { payload: AuthState }) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    signout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { signin, signout } = authSlice.actions;
export default authSlice.reducer;
