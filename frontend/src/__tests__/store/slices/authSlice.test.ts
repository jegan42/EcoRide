// frontend/src/__tests__/store/slices/authSlice.test.tsx
import authReducer, {
  signin,
  signout,
  type AuthState,
} from '../../../store/slices/authSlice';

describe('authSlice reducer', () => {
  const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
  };

  it('must return the initial default state', () => {
    expect(authReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should manage signin', () => {
    const user = { id: '123', username: 'Jean Dupont' };
    const action = signin({ user, isAuthenticated: true });
    const state = authReducer(initialState, action);

    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should manage signout', () => {
    const loggedInState: AuthState = {
      user: { id: '123', username: 'Jean Dupont' },
      isAuthenticated: true,
    };

    const action = signout();
    const state = authReducer(loggedInState, action);

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
