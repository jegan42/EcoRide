// frontend/src/__tests__/pages/ProfilePage.test.tsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfilePage from '../../../pages/profile/ProfilePage';
import * as userService from '../../../services/userService';
import * as snackbar from '../../../utils/enqueueSnackbar';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../store/slices/authSlice';
import { vi } from 'vitest';
import { enqueueSnackbarError } from '../../../utils/enqueueSnackbar';

vi.mock('../../../services/userService');

vi.mock('../../../utils/enqueueSnackbar', () => ({
  enqueueSnackbarSuccess: vi.fn(),
  enqueueSnackbarError: vi.fn(),
}));

const mockUser = {
  id: '1',
  username: 'johndoe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  role: ['user'],
  lastLogin: new Date().toISOString(),
};

const renderPage = (): ReturnType<typeof render> => {
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(
    <Provider store={store}>
      <ProfilePage />
    </Provider>
  );
};

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('affiche les informations du profil', async () => {
    (userService.fetchUser as jest.Mock).mockResolvedValue({
      data: mockUser,
      message: 'Profil chargé',
    });

    renderPage();

    expect(await screen.findByText('johndoe')).toBeInTheDocument();
    expect(screen.getByText(/modifier mon profil/i)).toBeInTheDocument();
  });

  it('passe en mode édition quand on clique sur "Modifier mon profil"', async () => {
    (userService.fetchUser as jest.Mock).mockResolvedValue({
      data: mockUser,
      message: 'Profil chargé',
    });

    renderPage();

    const editButton = await screen.findByRole('button', {
      name: /modifier mon profil/i,
    });

    await userEvent.click(editButton);

    expect(
      screen.getByRole('button', { name: /sauvegarder/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/prénom/i)).toHaveValue('John');
  });

  it('affiche une erreur si fetch échoue', async () => {
    (userService.fetchUser as jest.Mock).mockRejectedValue(
      new Error('Erreur réseau')
    );

    renderPage();

    expect(
      await screen.findByText(/erreur lors du chargement du profil/i)
    ).toBeInTheDocument();
  });

  it('soumet les modifications de profil', async () => {
    (userService.fetchUser as jest.Mock).mockResolvedValue({
      data: mockUser,
      message: 'Profil chargé',
    });
    (userService.updateUser as jest.Mock).mockResolvedValue({
      data: { ...mockUser, firstName: 'Johnny' },
      message: 'Profil mis à jour',
    });

    renderPage();

    const editBtn = await screen.findByRole('button', {
      name: /modifier mon profil/i,
    });
    await userEvent.click(editBtn);

    const input = screen.getByLabelText('Prénom');
    await userEvent.clear(input);
    await userEvent.type(input, 'Johnny');

    await userEvent.click(screen.getByRole('button', { name: /sauvegarder/i }));

    await waitFor(() =>
      expect(snackbar.enqueueSnackbarSuccess).toHaveBeenCalledWith(
        'Profil mis à jour'
      )
    );

    expect(screen.getByText('Johnny')).toBeInTheDocument();
  });

  it("affiche une erreur si l'utilisateur est invalide lors de la soumission", async () => {
    (userService.fetchUser as jest.Mock).mockResolvedValue({
      data: {},
      message: 'Profil chargé',
    });

    const mockUpdateUser = vi.spyOn(userService, 'updateUser');

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /modifier/i }));

    fireEvent.click(screen.getByRole('button', { name: /sauvegarder/i }));

    await waitFor(() => {
      expect(enqueueSnackbarError).toHaveBeenCalledWith(
        "L'utilisateur est invalide."
      );
      expect(mockUpdateUser).not.toHaveBeenCalled();
    });
  });

  it('affiche une erreur si la mise à jour du profil échoue', async () => {
    (userService.fetchUser as jest.Mock).mockResolvedValue({
      data: mockUser,
      message: 'Profil chargé',
    });

    (userService.updateUser as jest.Mock).mockRejectedValue(
      new Error('Échec API')
    );

    renderPage();

    const editButton = await screen.findByRole('button', {
      name: /modifier mon profil/i,
    });

    await userEvent.click(editButton);

    const firstNameInput = screen.getByLabelText(/prénom/i);
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'Jean');

    await userEvent.click(screen.getByRole('button', { name: /sauvegarder/i }));

    await waitFor(() => {
      expect(snackbar.enqueueSnackbarError).toHaveBeenCalledWith(
        expect.any(Error)
      );
      expect(
        screen.getByText(/erreur lors de la mise à jour du profil/i)
      ).toBeInTheDocument();
    });
  });

  it('revient à la vue non éditable après annulation', async () => {
    (userService.fetchUser as jest.Mock).mockResolvedValue({
      data: mockUser,
      message: 'Profil chargé',
    });

    renderPage();

    const editBtn = await screen.findByRole('button', {
      name: /modifier mon profil/i,
    });
    await userEvent.click(editBtn);

    expect(
      screen.getByRole('button', { name: /annuler/i })
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /annuler/i }));

    expect(
      await screen.findByRole('button', { name: /modifier mon profil/i })
    ).toBeInTheDocument();
  });
});
