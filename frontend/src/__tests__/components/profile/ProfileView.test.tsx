// frontend/src/__tests__/components/profile/ProfileView.test.tsx
import { render, screen, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import { ProfileView } from '../../../components/profile/ProfileView';

vi.mock('../../../hooks/useProfile', () => ({
  useProfile: () => ({
    user: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      credits: 100,
      phone: '1234567890',
      address: '123 Main St',
      role: ['admin', 'user'],
      lastLogin: new Date('2024-06-01T12:00:00Z').toISOString(),
    },
  }),
}));

// 🧪 Simule un store Redux minimal
const createMockStore = (): EnhancedStore =>
  configureStore({
    reducer: () => ({
      auth: {
        user: {
          id: 'u1',
          role: ['driver'],
        },
      },
    }),
  });

const renderWithProvider = (ui: React.ReactElement): RenderResult => {
  const store = createMockStore();
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('ProfileView', () => {
  it('correctly displays user information', () => {
    renderWithProvider(
      <ProfileView
        onSetProfileMode={vi.fn()}
        onSetVehicleMode={vi.fn()}
        profileTabs="preference"
        onSetProfileTabs={vi.fn()}
      />
    );

    const elements0 = screen.getAllByText(
      (_, el) => el?.textContent === 'Prénom : John'
    );
    expect(elements0).toHaveLength(1);
    expect(elements0[0]).toBeInTheDocument();
    const elements1 = screen.getAllByText(
      (_, el) => el?.textContent === 'Nom : Doe'
    );
    expect(elements1).toHaveLength(1);
    expect(elements1[0]).toBeInTheDocument();
    const elements2 = screen.getAllByText(
      (_, el) => el?.textContent === 'Email : john.doe@example.com'
    );
    expect(elements2).toHaveLength(1);
    expect(elements2[0]).toBeInTheDocument();
    const elements3 = screen.getAllByText(
      (_, el) => el?.textContent === 'Crédits : 100'
    );
    expect(elements3).toHaveLength(1);
    expect(elements3[0]).toBeInTheDocument();
    const elements4 = screen.getAllByText(
      (_, el) => el?.textContent === 'Rôles : admin, user'
    );
    expect(elements4).toHaveLength(1);
    expect(elements4[0]).toBeInTheDocument();
    const elements5 = screen.getAllByText(
      (_, el) => el?.textContent === 'Adresse : 123 Main St'
    );
    expect(elements5).toHaveLength(1);
    expect(elements5[0]).toBeInTheDocument();
    const elements6 = screen.getAllByText(
      (_, el) =>
        el?.textContent ===
        'Dernière connexion : ' +
          new Date('2024-06-01T12:00:00Z').toLocaleString()
    );
    expect(elements6).toHaveLength(1);
    expect(elements6[0]).toBeInTheDocument();
  });

  it('calls callbacks on button clicks', async () => {
    const onSetProfileMode = vi.fn();
    const onSetVehicleMode = vi.fn();

    renderWithProvider(
      <ProfileView
        onSetProfileMode={onSetProfileMode}
        onSetVehicleMode={onSetVehicleMode}
        profileTabs="trip"
        onSetProfileTabs={vi.fn()}
      />
    );

    await userEvent.click(
      screen.getByRole('button', { name: /Modifier mon profil/i })
    );
    expect(onSetProfileMode).toHaveBeenCalled();

    await userEvent.click(
      screen.getByRole('button', { name: /Ajouter un véhicule/i })
    );
    expect(onSetVehicleMode).toHaveBeenCalled();
  });
});
