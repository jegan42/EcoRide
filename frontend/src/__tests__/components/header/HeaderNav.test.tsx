// frontend/src/__tests__/components/header/HeaderNav.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HeaderNav } from '../../../components/header/HeaderNav';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import theme from '../../../styles/theme';
import { Provider } from 'react-redux';
import { vi } from 'vitest';
import authService from '../../../services/authService';
import { enqueueSnackbarSuccess } from '../../../utils/enqueueSnackbar';
import { useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../store/slices/authSlice';

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: {
      user: { id: '1', email: 'test@example.com' },
      isAuthenticated: true,
      loading: false,
      error: null,
      csrfToken: null,
    },
  },
});
vi.mock('../../../services/authService', () => ({
  default: {
    signout: vi.fn(),
  },
}));
vi.mock('../../../utils/enqueueSnackbar', () => ({
  enqueueSnackbarSuccess: vi.fn(),
}));
vi.mock('react-redux', async () => {
  const actual =
    await vi.importActual<typeof import('react-redux')>('react-redux');
  return {
    ...actual,
    useDispatch: vi.fn(),
  };
});
vi.mock('@mui/material', async () => {
  const actual =
    await vi.importActual<typeof import('@mui/material')>('@mui/material');
  return {
    ...actual,
    useMediaQuery: vi.fn(),
  };
});

const renderWithProviders = (): ReturnType<typeof render> =>
  render(
    <Provider store={mockStore}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <HeaderNav />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );

describe('HeaderNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays navigation links in desktop mode', () => {
    (useMediaQuery as unknown as jest.Mock).mockReturnValue(false);

    renderWithProviders();

    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('À propos')).toBeInTheDocument();
    expect(screen.getByText('Trouver trajet')).toBeInTheDocument();
    expect(screen.getByText('Tableau de board')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /connexion|déconnexion/i })
    ).toBeInTheDocument();
  });

  it('opens and closes the Drawer in mobile mode', async () => {
    (useMediaQuery as unknown as jest.Mock).mockReturnValue(true);

    renderWithProviders();

    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    expect(await screen.findByText('Accueil')).toBeInTheDocument();

    const backdrop = document.querySelector('.MuiBackdrop-root') as HTMLElement;
    fireEvent.click(backdrop);

    await waitFor(() => {
      expect(screen.queryByText('Accueil')).not.toBeInTheDocument();
    });
  });

  it('executes the logout successfully', async () => {
    (useMediaQuery as unknown as jest.Mock).mockReturnValue(false);
    const mockDispatch = vi.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (authService.signout as jest.Mock).mockResolvedValue({
      message: 'Bye',
      data: null,
    });

    renderWithProviders();

    const logoutBtn = screen.getByRole('button', { name: /déconnexion/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(authService.signout).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
      expect(enqueueSnackbarSuccess).toHaveBeenCalledWith('Bye');
    });
  });

  it('closes the Drawer when clicking on a link', async () => {
    (useMediaQuery as unknown as jest.Mock).mockReturnValue(true);

    renderWithProviders();

    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    const link = await screen.findByText('Accueil');
    expect(link).toBeInTheDocument();

    fireEvent.click(link);

    await waitFor(() => {
      expect(screen.queryByText('Accueil')).not.toBeInTheDocument();
    });
  });
});
