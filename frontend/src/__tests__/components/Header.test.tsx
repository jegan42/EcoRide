// frontend/src/__tests__/components/Header.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/Header';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import theme from '../../styles/theme';
import { vi } from 'vitest';
import { store } from '../../store';
import { Provider, useDispatch } from 'react-redux';
import authService from '../../services/authService';
import { enqueueSnackbarSuccess } from '../../utils/enqueueSnackbar';

vi.mock('../../services/authService', () => ({
  default: {
    signout: vi.fn(),
  },
}));

vi.mock('../../utils/enqueueSnackbar', () => ({
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
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    useMediaQuery: vi.fn(),
  };
});

const renderWithProviders = (
  ui: React.ReactElement
): ReturnType<typeof render> =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>{ui}</BrowserRouter>
      </ThemeProvider>
    </Provider>
  );

describe('Header', () => {
  describe('Drawer open', () => {
    beforeEach(() => {
      (useMediaQuery as unknown as jest.Mock).mockReset();
    });

    it('affiche drawer et bouton déconnexion en mode mobile, ouvre et ferme drawer', async () => {
      (useMediaQuery as unknown as jest.Mock).mockReturnValue(true);

      renderWithProviders(<Header />);

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      expect(await screen.findByText('Accueil')).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: /déconnexion/i })
      ).toBeInTheDocument();

      fireEvent.click(screen.getByText('Accueil'));

      await waitFor(() => {
        expect(screen.queryByText('Accueil')).not.toBeInTheDocument();
      });
    });
  });

  describe('Drawer close', () => {
    it('ferme le drawer quand on clique en dehors (onClose)', async () => {
      renderWithProviders(<Header />);

      const burgerButton = screen.getByRole('button');
      fireEvent.click(burgerButton);

      expect(await screen.findByText('Accueil')).toBeInTheDocument();

      const backdrop = document.querySelector(
        '.MuiBackdrop-root'
      ) as HTMLElement;
      expect(backdrop).toBeTruthy();
      fireEvent.click(backdrop);

      await waitFor(() => {
        expect(screen.queryByText('Accueil')).not.toBeInTheDocument();
      });
    });
  });

  it('déclenche signout, dispatch et notification succès au clic sur Déconnexion', async () => {
    const mockDispatch = vi.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useMediaQuery as jest.Mock).mockReturnValue(false);

    const fakeMessage = 'Déconnexion réussie';
    (authService.signout as jest.Mock).mockResolvedValue({
      message: fakeMessage,
      data: null,
    });

    renderWithProviders(<Header />);

    const logoutButton = screen.getByRole('button', { name: /déconnexion/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(authService.signout).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
      expect(enqueueSnackbarSuccess).toHaveBeenCalledWith(fakeMessage);
    });
  });
});
