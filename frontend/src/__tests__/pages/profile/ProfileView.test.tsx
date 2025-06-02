// frontend/src/__tests__/pages/ProfileView.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileView from '../../../pages/profile/ProfileView';
import type { User } from '../../../types/user';

describe('ProfileView', () => {
  const mockUser: Partial<User> = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean@example.com',
    phone: '0123456789',
    address: '123 Rue de Paris',
    credits: 42,
    role: ['passenger', 'admin'],
    lastLogin: new Date('2024-01-01T10:00:00Z').toISOString(),
  };

  it('affiche correctement les informations de l’utilisateur', () => {
    render(<ProfileView user={mockUser} setIsEditing={vi.fn()} />);

    const elements0 = screen.getAllByText(
      (_, el) => el?.textContent === 'Prénom : Jean'
    );
    expect(elements0).toHaveLength(1);
    expect(elements0[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.textContent?.replace(/\s+/g, ' ').trim() === 'Prénom : Jean'
      )
    ).toBeInTheDocument();
    const elements1 = screen.getAllByText(
      (_, el) => el?.textContent === 'Nom : Dupont'
    );
    expect(elements1).toHaveLength(1);
    expect(elements1[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.textContent?.replace(/\s+/g, ' ').trim() === 'Nom : Dupont'
      )
    ).toBeInTheDocument();
    const elements2 = screen.getAllByText(
      (_, el) => el?.textContent === 'Email : jean@example.com'
    );
    expect(elements2).toHaveLength(1);
    expect(elements2[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.textContent?.replace(/\s+/g, ' ').trim() ===
          'Email : jean@example.com'
      )
    ).toBeInTheDocument();
    const elements3 = screen.getAllByText(
      (_, el) => el?.textContent === 'Téléphone : 0123456789'
    );
    expect(elements3).toHaveLength(1);
    expect(elements3[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.textContent?.replace(/\s+/g, ' ').trim() ===
          'Téléphone : 0123456789'
      )
    ).toBeInTheDocument();
    const elements4 = screen.getAllByText(
      (_, el) => el?.textContent === 'Adresse : 123 Rue de Paris'
    );
    expect(elements4).toHaveLength(1);
    expect(elements4[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.textContent?.replace(/\s+/g, ' ').trim() ===
          'Adresse : 123 Rue de Paris'
      )
    ).toBeInTheDocument();
    const elements5 = screen.getAllByText(
      (_, el) => el?.textContent === 'Crédits : 42'
    );
    expect(elements5).toHaveLength(1);
    expect(elements5[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.textContent?.replace(/\s+/g, ' ').trim() === 'Crédits : 42'
      )
    ).toBeInTheDocument();
    const elements6 = screen.getAllByText(
      (_, el) => el?.textContent === 'Rôles : passenger, admin'
    );
    expect(elements6).toHaveLength(1);
    expect(elements6[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.textContent?.replace(/\s+/g, ' ').trim() ===
          'Rôles : passenger, admin'
      )
    ).toBeInTheDocument();
    const elements7 = screen.getAllByText(
      (_, el) =>
        el?.textContent === 'Dernière connexion : 1/1/2024, 11:00:00 AM'
    );
    expect(elements7).toHaveLength(1);
    expect(elements7[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.textContent?.replace(/\s+/g, ' ').trim() ===
          'Dernière connexion : 1/1/2024, 11:00:00 AM'
      )
    ).toBeInTheDocument();
  });

  it('affiche "Non renseigné" pour les champs manquants', () => {
    render(<ProfileView user={{}} setIsEditing={vi.fn()} />);

    const elements0 = screen.getAllByText(
      (_, el) => el?.textContent === 'Prénom : Non renseigné'
    );
    expect(elements0).toHaveLength(1);
    expect(elements0[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.textContent?.replace(/\s+/g, ' ').trim() ===
          'Prénom : Non renseigné'
      )
    ).toBeInTheDocument();
    const elements1 = screen.getAllByText(
      (_, el) => el?.textContent === 'Nom : Non renseigné'
    );
    expect(elements1).toHaveLength(1);
    expect(elements1[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.textContent?.replace(/\s+/g, ' ').trim() === 'Nom : Non renseigné'
      )
    ).toBeInTheDocument();
    const elements2 = screen.getAllByText(
      (_, el) => el?.textContent === 'Email : Non renseigné'
    );
    expect(elements2).toHaveLength(1);
    expect(elements2[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.textContent?.replace(/\s+/g, ' ').trim() ===
          'Email : Non renseigné'
      )
    ).toBeInTheDocument();
    const elements3 = screen.getAllByText(
      (_, el) => el?.textContent === 'Crédits : Non renseigné'
    );
    expect(elements3).toHaveLength(1);
    expect(elements3[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.textContent?.replace(/\s+/g, ' ').trim() ===
          'Crédits : Non renseigné'
      )
    ).toBeInTheDocument();
    const elements4 = screen.getAllByText(
      (_, el) => el?.textContent === 'Rôles : Non renseigné'
    );
    expect(elements4).toHaveLength(1);
    expect(elements4[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.textContent?.replace(/\s+/g, ' ').trim() ===
          'Rôles : Non renseigné'
      )
    ).toBeInTheDocument();
    const elements5 = screen.getAllByText(
      (_, el) => el?.textContent === 'Dernière connexion : Non disponible'
    );
    expect(elements5).toHaveLength(1);
    expect(elements5[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.textContent?.replace(/\s+/g, ' ').trim() ===
          'Dernière connexion : Non disponible'
      )
    ).toBeInTheDocument();
  });

  it('déclenche setIsEditing lors du clic sur "Modifier mon profil"', () => {
    const mockSetIsEditing = vi.fn();
    render(<ProfileView user={mockUser} setIsEditing={mockSetIsEditing} />);

    const button = screen.getByRole('button', { name: /modifier mon profil/i });
    fireEvent.click(button);

    expect(mockSetIsEditing).toHaveBeenCalledTimes(1);
  });
});
