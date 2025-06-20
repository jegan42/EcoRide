// frontend/src/store/slices/AuthSlices.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/user';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  csrfToken: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  csrfToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    signin(
      state,
      action: PayloadAction<{ user: User; isAuthenticated: boolean }>
    ) {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.loading = false;
    },
    signout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setCsrfToken(state, action: PayloadAction<string>) {
      state.csrfToken = action.payload;
    },
    setUser(state, action: PayloadAction<{ user: User }>) {
      state.user = action.payload.user;
      state.loading = false;
    },
  },
});

export const { setAuthLoading, signin, signout, setCsrfToken, setUser } =
  authSlice.actions;
export default authSlice.reducer;
