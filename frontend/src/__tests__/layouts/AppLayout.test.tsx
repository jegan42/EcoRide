// frontend/src/__tests__/layouts/AppLayout.test.tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import authReducer from '../../store/slices/authSlice';
import userService from '../../services/userService';
import { vi } from 'vitest';
import * as csrfModule from '../../services/csrfService';
import {
  enqueueSnackbarSuccess,
  enqueueSnackbarError,
} from '../../utils/enqueueSnackbar';

vi.mock('../../services/csrfService', async () => {
  const actual = await vi.importActual('../../services/csrfService');
  return {
    ...actual,
    getCsrfToken: vi.fn(),
  };
});

vi.mock('../../utils/enqueueSnackbar', () => ({
  enqueueSnackbarSuccess: vi.fn(),
  enqueueSnackbarError: vi.fn(),
}));

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
        loading: true,
        csrfToken: null,
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

  it('met à jour le store si fetchUser réussit', async () => {
    const mockUser = {
      message: 'testhere',
      data: { name: 'Jean', email: 'jean@example.com' },
    };
    vi.spyOn(userService, 'fetchUser').mockResolvedValue(mockUser);

    const customStore = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: false,
          loading: true,
          csrfToken: null,
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
    expect(state.auth.user).toEqual(mockUser.data);
    expect(state.auth.isAuthenticated).toBe(true);
  });

  it('récupère le token CSRF et dispatch setCsrfToken, puis affiche notification succès', async () => {
    const fakeToken = 'fake-csrf-token';
    const fakeMessage = 'CSRF token fetched';

    (csrfModule.getCsrfToken as ReturnType<typeof vi.fn>).mockResolvedValue({
      message: fakeMessage,
      data: fakeToken,
    });

    const customStore = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: false,
          loading: true,
          csrfToken: null,
        },
      },
    });

    render(
      <Provider store={customStore}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<div>Page test CSRF</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await screen.findByText('Page test CSRF');

    const state = customStore.getState();
    expect(state.auth.csrfToken).toBe(fakeToken);

    expect(enqueueSnackbarSuccess).toHaveBeenCalledWith(fakeMessage);
  });

  it('affiche notification erreur si getCsrfToken échoue', async () => {
    const error = new Error('Erreur CSRF');

    (csrfModule.getCsrfToken as ReturnType<typeof vi.fn>).mockRejectedValue(
      error
    );

    const customStore = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: false,
          loading: true,
          csrfToken: null,
        },
      },
    });

    render(
      <Provider store={customStore}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<div>Page test erreur CSRF</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await screen.findByText('Page test erreur CSRF');

    expect(enqueueSnackbarError).toHaveBeenCalledWith(error);
  });
});
