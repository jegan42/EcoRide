// frontend/src/__tests__/hooks/useInitApp.test.tsx
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, type Store } from '@reduxjs/toolkit';
import { vi } from 'vitest';

import { useInitApp } from '../../hooks/useInitApp';
import authReducer from '../../store/slices/authSlice';
import * as csrfService from '../../services/csrfService';
import * as userService from '../../services/userService';
import * as snackbar from '../../utils/enqueueSnackbar';

vi.mock('../../services/userService');
vi.mock('../../services/csrfService');
vi.mock('../../utils/enqueueSnackbar', () => ({
  enqueueSnackbarSuccess: vi.fn(),
  enqueueSnackbarError: vi.fn(),
  enqueueSnackbar: vi.fn(),
}));

describe('useInitApp', () => {
  const getTestStore = (
    isAuthenticated = false
  ): Store<{
    auth: ReturnType<typeof authReducer>;
  }> =>
    configureStore({
      reducer: { auth: authReducer },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated,
          loading: false,
          csrfToken: null,
        },
      },
    });

  const wrapper = (
    store: ReturnType<typeof getTestStore>
  ): React.FC<{ children: React.ReactNode }> => {
    const ReduxProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
      children,
    }) => <Provider store={store}>{children}</Provider>;

    ReduxProviderWrapper.displayName = 'ReduxProviderWrapper';

    return ReduxProviderWrapper;
  };

  it('retrieves the CSRF token and stores it', async () => {
    const mockToken = 'mock-token';
    const mockMessage = 'CSRF token ok';
    (csrfService.getCsrfToken as jest.Mock).mockResolvedValue({
      data: mockToken,
      message: mockMessage,
    });
    const successSpy = vi.spyOn(snackbar, 'enqueueSnackbarSuccess');

    const store = getTestStore();

    renderHook(() => useInitApp(), {
      wrapper: wrapper(store),
    });

    await new Promise((r) => setTimeout(r, 10));

    expect(store.getState().auth.csrfToken).toBe(mockToken);
    expect(successSpy).toHaveBeenCalledWith(mockMessage);
  });

  it('retrieves user if unauthenticated', async () => {
    const user = { firstName: 'Jean', lastName: 'Dupont' };
    (csrfService.getCsrfToken as jest.Mock).mockResolvedValue({
      data: 'csrf-token',
      message: 'CSRF ok',
    });
    (userService.fetchUser as jest.Mock).mockResolvedValue({
      data: user,
      message: 'Welcom',
    });

    const store = getTestStore();
    const successSpy = vi.spyOn(snackbar, 'enqueueSnackbarSuccess');

    renderHook(() => useInitApp(), {
      wrapper: wrapper(store),
    });

    await new Promise((r) => setTimeout(r, 10));

    const state = store.getState().auth;
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(successSpy).toHaveBeenCalledWith('Welcom');
  });

  it('dispatch signout if fetchUser failed', async () => {
    (csrfService.getCsrfToken as jest.Mock).mockResolvedValue({
      data: 'csrf-token',
      message: 'CSRF ok',
    });
    (userService.fetchUser as jest.Mock).mockRejectedValue(
      new Error('Unauthorized')
    );

    const store = getTestStore();

    renderHook(() => useInitApp(), {
      wrapper: wrapper(store),
    });

    await new Promise((r) => setTimeout(r, 10));

    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
