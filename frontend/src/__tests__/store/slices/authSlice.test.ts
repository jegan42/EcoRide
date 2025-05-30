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

  it('devrait retourner l’état initial', () => {
    expect(authReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  it('devrait gérer signin', () => {
    const fakeUser = { id: '1', name: 'Test User' };
    const action = signin({ user: fakeUser, isAuthenticated: true });
    const newState = authReducer(initialState, action);

    expect(newState.user).toEqual(fakeUser);
    expect(newState.isAuthenticated).toBe(true);
  });

  it('devrait gérer signout', () => {
    const loggedState: AuthState = {
      user: { id: '1', username: 'Test User' },
      isAuthenticated: true,
    };

    const newState = authReducer(loggedState, signout());

    expect(newState.user).toBeNull();
    expect(newState.isAuthenticated).toBe(false);
  });
});
