// frontend/src/__tests__/router/AppRouter.test.tsx
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AppRouter from '../../router/AppRouter';
import authReducer, { type AuthState } from '../../store/slices/authSlice';
import * as useAppSelectorHook from '../../hooks/useAppSelector';
import ToastProvider from '../../providers/ToastProvider';

vi.mock('../../hooks/useAppSelector');

describe('AppRouter', () => {
  const renderWithAuthState = (isAuthenticated: boolean): void => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          user: isAuthenticated ? { name: 'Jean' } : null,
          isAuthenticated,
        } as AuthState,
      },
    });

    (useAppSelectorHook.useAppSelector as jest.Mock).mockImplementation(
      (selector: (state: ReturnType<typeof store.getState>) => unknown) =>
        selector(store.getState())
    );

    render(
      <Provider store={store}>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </Provider>
    );
  };

  it('redirige vers SigninPage si non authentifié', async () => {
    window.history.pushState({}, 'Test page', '/');
    renderWithAuthState(false);

    expect(
      await screen.findByRole('button', { name: 'Se connecter avec Google' })
    ).toBeInTheDocument();
  });

  it('affiche Dashboard si authentifié', async () => {
    window.history.pushState({}, 'Test page', '/');
    renderWithAuthState(true);
    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
  });
});
