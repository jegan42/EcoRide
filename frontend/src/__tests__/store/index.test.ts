// frontend/src/__tests__/store/index.test.ts
import { store, type RootState, type AppDispatch } from '../../store';
import { signin, signout } from '../../store/slices/authSlice';

describe('store configuration', () => {
  it('devrait avoir un state initial correct', () => {
    const state = store.getState();
    expect(state.auth).toEqual({
      csrfToken: null,
      user: null,
      isAuthenticated: false,
      loading: true,
    });
  });

  it('should allow the dispatch of an action', () => {
    store.dispatch(
      signin({ user: { id: '1', username: 'Jean' }, isAuthenticated: true })
    );
    const state = store.getState();
    expect(state.auth.user).toEqual({ id: '1', username: 'Jean' });
    expect(state.auth.isAuthenticated).toBe(true);
  });

  it('should respect RootState and AppDispatch types', () => {
    const state: RootState = store.getState();
    const dispatch: AppDispatch = store.dispatch;

    expect(state.auth.isAuthenticated).toBe(true);

    dispatch(signout());
    const newState = store.getState();
    expect(newState.auth.isAuthenticated).toBe(false);
  });
});
