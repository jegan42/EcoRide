// frontend/src/__tests__/pages/ProfileForm.test.tsx
import { describe, it, vi, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfileForm from '../../../pages/profile/ProfilForm';
import userEvent from '@testing-library/user-event';

const mockUser = {
  id: '123',
  firstName: 'Jean',
  lastName: 'Dupont',
  phone: '0123456789',
  address: '1 rue de Paris',
  avatar: 'http://example.com/avatar.png',
};

describe('ProfileForm', () => {
  it('affiche les champs pré-remplis', () => {
    render(
      <ProfileForm
        user={mockUser}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Prénom')).toHaveValue('Jean');
    expect(screen.getByLabelText('Nom')).toHaveValue('Dupont');
    expect(screen.getByLabelText('Téléphone')).toHaveValue('0123456789');
    expect(screen.getByLabelText('Adresse')).toHaveValue('1 rue de Paris');
    expect(screen.getByLabelText('Avatar (URL)')).toHaveValue(
      'http://example.com/avatar.png'
    );
  });

  it('valide le formulaire et appelle onSubmit', async () => {
    const handleSubmit = vi.fn();
    render(
      <ProfileForm
        user={mockUser}
        isSubmitting={false}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /sauvegarder/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);

    expect(handleSubmit.mock.calls[0][0]).toEqual({
      id: '123',
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '0123456789',
      address: '1 rue de Paris',
      avatar: 'http://example.com/avatar.png',
    });
  });

  it('initialise les champs à vide si aucun utilisateur n’est fourni', () => {
    render(
      <ProfileForm
        user={null}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Prénom')).toHaveValue('');
    expect(screen.getByLabelText('Nom')).toHaveValue('');
    expect(screen.getByLabelText('Téléphone')).toHaveValue('');
    expect(screen.getByLabelText('Adresse')).toHaveValue('');
    expect(screen.getByLabelText('Avatar (URL)')).toHaveValue('');
  });

  it('utilise des valeurs vides pour les champs manquants', () => {
    render(
      <ProfileForm
        user={{ firstName: 'Alice' }}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Prénom')).toHaveValue('Alice');
    expect(screen.getByLabelText('Nom')).toHaveValue('');
    expect(screen.getByLabelText('Téléphone')).toHaveValue('');
    expect(screen.getByLabelText('Adresse')).toHaveValue('');
    expect(screen.getByLabelText('Avatar (URL)')).toHaveValue('');
  });

  it('appelle onCancel quand on clique sur "Annuler"', async () => {
    const handleCancel = vi.fn();
    render(
      <ProfileForm
        user={mockUser}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={handleCancel}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /annuler/i }));
    expect(handleCancel).toHaveBeenCalled();
  });

  it('désactive le bouton Sauvegarder si isSubmitting est true', () => {
    render(
      <ProfileForm
        user={mockUser}
        isSubmitting={true}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /sauvegarder/i })).toBeDisabled();
  });
});
