// frontend/src/__tests__/layouts/AppLayout.test.tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import authReducer from '../../store/slices/authSlice';
import userService from '../../services/userService';
import { vi } from 'vitest';
import { enqueueSnackbar } from 'notistack';

vi.mock('notistack', () => ({
  enqueueSnackbar: vi.fn(),
}));

describe('AppLayout', () => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: null,
        isAuthenticated: false,
      },
    },
  });

  it('rend le layout avec Header, Footer et Outlet', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<div>Contenu Test</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Contenu Test')).toBeInTheDocument();
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('Suivez-nous')).toBeInTheDocument();
  });

  it('affiche une notification si fetchUser échoue', async () => {
    vi.spyOn(userService, 'fetchUser').mockRejectedValue(
      new Error('Erreur test')
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<div>Test</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await screen.findByText('Test');

    expect(enqueueSnackbar).toHaveBeenCalledWith(
      'Utilisateur non connecté ou session expirée',
      { variant: 'error' }
    );
  });

  it('met à jour le store si fetchUser réussit', async () => {
    const mockUser = { name: 'Jean', email: 'jean@example.com' };
    vi.spyOn(userService, 'fetchUser').mockResolvedValue(mockUser);

    const customStore = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: false,
        },
      },
    });

    render(
      <Provider store={customStore}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<div>Page test</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await screen.findByText('Page test');

    const state = customStore.getState();
    expect(state.auth.user).toEqual(mockUser);
    expect(state.auth.isAuthenticated).toBe(true);
  });
});
