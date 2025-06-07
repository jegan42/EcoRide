// frontend/src/__tests__/components/profile/ProfileForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ProfileForm } from '../../../components/profile/ProfileForm';

vi.mock('../../../hooks/useProfile', () => ({
  useProfile: () => ({
    user: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      address: '123 Main St',
      avatar: 'https://example.com/avatar.jpg',
    },
  }),
}));

describe('ProfileForm', () => {
  it('renders all fields correctly', () => {
    render(
      <ProfileForm isSubmitting={false} onSubmit={vi.fn()} onCancel={vi.fn()} />
    );

    const labels = ['Prénom', 'Nom', 'Téléphone', 'Adresse', 'Avatar (URL)'];
    labels.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('calls onSubmit with valid data', async () => {
    const onSubmit = vi.fn();
    render(
      <ProfileForm
        isSubmitting={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />
    );
    await userEvent.clear(screen.getByLabelText('Prénom'));
    await userEvent.type(screen.getByLabelText('Prénom'), 'Jane');

    await userEvent.clear(screen.getByLabelText('Nom'));
    await userEvent.type(screen.getByLabelText('Nom'), 'Smith');

    await userEvent.clear(screen.getByLabelText('Téléphone'));
    await userEvent.type(screen.getByLabelText('Téléphone'), '0987654321');

    await userEvent.clear(screen.getByLabelText('Adresse'));
    await userEvent.type(screen.getByLabelText('Adresse'), '456 Elm St');

    await userEvent.clear(screen.getByLabelText('Avatar (URL)'));
    await userEvent.type(
      screen.getByLabelText('Avatar (URL)'),
      'https://example.com/new-avatar.jpg'
    );

    await userEvent.click(screen.getByRole('button', { name: /Sauvegarder/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '0987654321',
          address: '456 Elm St',
          avatar: 'https://example.com/new-avatar.jpg',
        }),
        expect.anything()
      )
    );
  });

  it('disables submit button when isSubmitting is true', () => {
    render(
      <ProfileForm isSubmitting={true} onSubmit={vi.fn()} onCancel={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: /Sauvegarder/i })).toBeDisabled();
  });
});

describe('ProfileForm - empty user', () => {
  it('initializes all fields to empty strings when user is undefined', () => {
    vi.mock('../../../hooks/useProfile', () => ({
      useProfile: () => ({ user: undefined }),
    }));
    render(
      <ProfileForm isSubmitting={false} onSubmit={vi.fn()} onCancel={vi.fn()} />
    );

    expect(screen.getByLabelText('Prénom')).toHaveValue('');
    expect(screen.getByLabelText('Nom')).toHaveValue('');
    expect(screen.getByLabelText('Téléphone')).toHaveValue('');
    expect(screen.getByLabelText('Adresse')).toHaveValue('');
    expect(screen.getByLabelText('Avatar (URL)')).toHaveValue('');
  });
});
