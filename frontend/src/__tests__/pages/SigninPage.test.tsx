// frontend/src/__tests__/pages/SigninPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SigninPage from '../../pages/SigninPage';
import authService from '../../services/authService';
import { enqueueSnackbar } from 'notistack';
import { vi, type MockedFunction } from 'vitest';
import { useAppSelector } from '../../hooks/useAppSelector';

vi.mock('../../services/authService');
vi.mock('notistack', () => ({
  enqueueSnackbar: vi.fn(),
}));

vi.mock('../../hooks/useAppSelector', () => ({
  useAppSelector: vi.fn(),
}));
const mockAppSelector = useAppSelector as jest.Mock;

const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../forms/SigninForm', () => ({
  __esModule: true,
  default: ({
    onSubmit,
  }: {
    onSubmit: (data: { email: string; password: string }) => void;
  }) => (
    <button
      onClick={() => onSubmit({ email: 'test@test.com', password: '1234' })}
      data-testid="signin-submit"
    >
      Mock SigninForm Submit
    </button>
  ),
}));

vi.mock('../../forms/SignupForm', () => ({
  __esModule: true,
  default: ({
    onSubmit,
  }: {
    onSubmit: (data: { email: string; password: string }) => void;
  }) => (
    <button
      onClick={() => onSubmit({ email: 'new@test.com', password: 'abcd' })}
      data-testid="signup-submit"
    >
      Mock SignupForm Submit
    </button>
  ),
}));

describe('SigninPage E2E', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirect if already authenticated', async () => {
    mockAppSelector.mockImplementation(
      (
        cb: (state: { auth: { isAuthenticated: boolean } }) => {
          auth: { isAuthenticated: boolean };
        }
      ) => cb({ auth: { isAuthenticated: true } })
    );

    render(<SigninPage />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('display login form by default', () => {
    mockAppSelector.mockImplementation(
      (
        cb: (state: { auth: { isAuthenticated: boolean } }) => {
          auth: { isAuthenticated: boolean };
        }
      ) => cb({ auth: { isAuthenticated: false } })
    );

    render(<SigninPage />);
    expect(screen.getByText('Se connecter')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Se connecter avec Google/i })
    ).toBeInTheDocument();
    expect(screen.getByText('OU')).toBeInTheDocument();

    expect(screen.getByTestId('signin-submit')).toBeInTheDocument();
  });

  it('change tab and display registration form', async () => {
    mockAppSelector.mockImplementation(
      (
        cb: (state: { auth: { isAuthenticated: boolean } }) => {
          auth: { isAuthenticated: boolean };
        }
      ) => cb({ auth: { isAuthenticated: false } })
    );

    render(<SigninPage />);

    await userEvent.click(screen.getByRole('button', { name: /S’inscrire/i }));

    expect(
      screen.queryByText('Se connecter avec Google')
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('signup-submit')).toBeInTheDocument();
  });

  it('submit login successfully', async () => {
    mockAppSelector.mockImplementation(
      (
        cb: (state: { auth: { isAuthenticated: boolean } }) => {
          auth: { isAuthenticated: boolean };
        }
      ) => cb({ auth: { isAuthenticated: false } })
    );

    const fakeUser = { id: '1', name: 'Test User' };
    (
      authService.signin as MockedFunction<typeof authService.signin>
    ).mockResolvedValue(fakeUser);

    render(<SigninPage />);

    await userEvent.click(screen.getByTestId('signin-submit'));

    await waitFor(() => {
      expect(authService.signin).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: '1234',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: { user: fakeUser, isAuthenticated: true },
        type: 'auth/signin',
      });
      expect(enqueueSnackbar).toHaveBeenCalledWith('Connexion envoyée !', {
        variant: 'success',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('display error message if connection fails', async () => {
    mockAppSelector.mockImplementation(
      (
        cb: (state: { auth: { isAuthenticated: boolean } }) => {
          auth: { isAuthenticated: boolean };
        }
      ) => cb({ auth: { isAuthenticated: false } })
    );

    (
      authService.signin as MockedFunction<typeof authService.signin>
    ).mockRejectedValue({
      response: { data: { message: 'Erreur custom' } },
      isAxiosError: true,
    });

    render(<SigninPage />);

    await userEvent.click(screen.getByTestId('signin-submit'));

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Erreur custom', {
        variant: 'error',
      });
    });
  });

  it('submit registration successfully', async () => {
    mockAppSelector.mockImplementation(
      (
        cb: (state: { auth: { isAuthenticated: boolean } }) => {
          auth: { isAuthenticated: boolean };
        }
      ) => cb({ auth: { isAuthenticated: false } })
    );

    const fakeUser = { id: '2', name: 'New User' };
    (
      authService.signup as MockedFunction<typeof authService.signup>
    ).mockResolvedValue(fakeUser);

    render(<SigninPage />);

    await userEvent.click(screen.getByRole('button', { name: /S’inscrire/i }));

    await userEvent.click(screen.getByTestId('signup-submit'));

    await waitFor(() => {
      expect(authService.signup).toHaveBeenCalledWith({
        email: 'new@test.com',
        password: 'abcd',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: { user: fakeUser, isAuthenticated: true },
        type: 'auth/signin',
      });
      expect(enqueueSnackbar).toHaveBeenCalledWith('Inscription envoyée !', {
        variant: 'success',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message if registration fails', async () => {
    mockAppSelector.mockImplementation(
      (
        cb: (state: { auth: { isAuthenticated: boolean } }) => {
          auth: { isAuthenticated: boolean };
        }
      ) => cb({ auth: { isAuthenticated: false } })
    );

    (
      authService.signup as MockedFunction<typeof authService.signup>
    ).mockRejectedValue({
      response: { data: { message: 'Erreur inscription' } },
      isAxiosError: true,
    });

    render(<SigninPage />);

    await userEvent.click(screen.getByRole('button', { name: /S’inscrire/i }));

    await userEvent.click(screen.getByTestId('signup-submit'));

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Erreur inscription', {
        variant: 'error',
      });
    });
  });
});

describe('SigninPage complete coverage test', () => {
  it('redirects to Google auth when the button is clicked', async () => {
    const originalLocation = window.location;

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '', assign: vi.fn() },
    });

    mockAppSelector.mockImplementation(
      (
        cb: (state: { auth: { isAuthenticated: boolean } }) => {
          auth: { isAuthenticated: boolean };
        }
      ) => cb({ auth: { isAuthenticated: false } })
    );

    render(<SigninPage />);

    const googleButton = screen.getByRole('button', {
      name: /Se connecter avec Google/i,
    });

    await userEvent.click(googleButton);

    expect(window.location.href).toBe(
      `${import.meta.env.VITE_API_URL}/auth/google`
    );

    window.location = originalLocation as string & Location;
  });

  it('display default message if non-axios error', async () => {
    mockAppSelector.mockImplementation(
      (
        cb: (state: { auth: { isAuthenticated: boolean } }) => {
          auth: { isAuthenticated: boolean };
        }
      ) => cb({ auth: { isAuthenticated: false } })
    );

    (
      authService.signin as MockedFunction<typeof authService.signin>
    ).mockRejectedValue(new Error('Erreur inconnue'));

    render(<SigninPage />);

    await userEvent.click(screen.getByTestId('signin-submit'));

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Échec de la connexion, veuillez réessayer',
        { variant: 'error' }
      );
    });
  });
  it('display default message if axios error without message', async () => {
    mockAppSelector.mockImplementation(
      (
        cb: (state: { auth: { isAuthenticated: boolean } }) => {
          auth: { isAuthenticated: boolean };
        }
      ) => cb({ auth: { isAuthenticated: false } })
    );

    (
      authService.signin as MockedFunction<typeof authService.signin>
    ).mockRejectedValue({
      isAxiosError: true,
      response: {},
    });

    render(<SigninPage />);

    await userEvent.click(screen.getByTestId('signin-submit'));

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Échec de la connexion, veuillez réessayer',
        { variant: 'error' }
      );
    });
  });

  it('displays error message if registration fails', async () => {
    mockAppSelector.mockImplementation(
      (
        cb: (state: { auth: { isAuthenticated: boolean } }) => {
          auth: { isAuthenticated: boolean };
        }
      ) => cb({ auth: { isAuthenticated: false } })
    );

    (
      authService.signup as MockedFunction<typeof authService.signup>
    ).mockRejectedValue({
      response: { data: { message: 'Erreur inscription' } },
      isAxiosError: true,
    });

    render(<SigninPage />);

    await userEvent.click(screen.getByRole('button', { name: /S’inscrire/i }));
    await userEvent.click(screen.getByTestId('signup-submit'));

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Erreur inscription', {
        variant: 'error',
      });
    });
  });

  it('display default message if axios error without message (signup)', async () => {
    mockAppSelector.mockImplementation(
      (
        cb: (state: { auth: { isAuthenticated: boolean } }) => {
          auth: { isAuthenticated: boolean };
        }
      ) => cb({ auth: { isAuthenticated: false } })
    );

    (
      authService.signup as MockedFunction<typeof authService.signup>
    ).mockRejectedValue({
      isAxiosError: true,
      response: {},
    });

    render(<SigninPage />);

    await userEvent.click(screen.getByRole('button', { name: /S’inscrire/i }));
    await userEvent.click(screen.getByTestId('signup-submit'));

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Échec de l’inscription, veuillez réessayer',
        { variant: 'error' }
      );
    });
  });

  it('display default message if error not axios (signup)', async () => {
    mockAppSelector.mockImplementation(
      (
        cb: (state: { auth: { isAuthenticated: boolean } }) => {
          auth: { isAuthenticated: boolean };
        }
      ) => cb({ auth: { isAuthenticated: false } })
    );

    (
      authService.signup as MockedFunction<typeof authService.signup>
    ).mockRejectedValue(new Error('Erreur JS'));

    render(<SigninPage />);

    await userEvent.click(screen.getByRole('button', { name: /S’inscrire/i }));
    await userEvent.click(screen.getByTestId('signup-submit'));

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Échec de l’inscription, veuillez réessayer',
        { variant: 'error' }
      );
    });
  });
});
