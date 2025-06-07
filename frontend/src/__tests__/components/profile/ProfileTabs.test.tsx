// frontend/src/__tests__/components/profile/ProfileTabs.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ProfileTabs,
  type ProfileTabsMode,
} from '../../../components/profile/ProfileTabs';
import { useAppSelector } from '../../../hooks/useAppSelector';
import * as hasRoleModule from '../../../utils/hasRole';
import * as reduxHooks from '../../../hooks/useAppSelector';
import { vi } from 'vitest';
import type { User } from '../../../types/user';

vi.mock('../../../hooks/useAppSelector', () => ({
  useAppSelector: vi.fn(),
}));

describe('ProfileTabs', (): void => {
  const mockOnChange = vi.fn();

  const setup = (
    user: Partial<User>,
    currentTab: ProfileTabsMode = 'preference'
  ): void => {
    (useAppSelector as jest.Mock).mockReturnValue({ user });
    vi.spyOn(hasRoleModule, 'hasRole').mockImplementation(
      (u, role) => !!u?.role?.includes(role)
    );

    render(<ProfileTabs profileTabs={currentTab} onChange={mockOnChange} />);
  };

  afterEach(() => {
    vi.resetAllMocks();
    mockOnChange.mockReset();
  });

  it('calls onChange with the correct tab key when clicked', () => {
    const user = { id: '1', role: ['driver'] } as Partial<User>;
    setup(user);

    fireEvent.click(screen.getByText('Voyages'));
    expect(mockOnChange).toHaveBeenCalledWith('trip');
  });
});

describe('ProfileTabs - isDriver logic', () => {
  const baseUser = {
    id: '123',
    username: 'John',
    roles: [],
  };

  it('shows driver tabs when user has driver role', () => {
    vi.spyOn(reduxHooks, 'useAppSelector').mockReturnValue({
      user: { ...baseUser, role: ['driver'] },
    });

    render(<ProfileTabs profileTabs="preference" onChange={vi.fn()} />);

    expect(screen.getByText('Véhicules')).toBeInTheDocument();
    expect(screen.getByText('Voyages')).toBeInTheDocument();
    expect(screen.getByText('Réservation')).toBeInTheDocument();
    expect(screen.getByText('Préférences')).toBeInTheDocument();
  });

  it('hides driver tabs when user does not have driver role', () => {
    vi.spyOn(reduxHooks, 'useAppSelector').mockReturnValue({
      user: { ...baseUser, role: ['passenger'] },
    });

    render(<ProfileTabs profileTabs="preference" onChange={vi.fn()} />);

    expect(screen.queryByText('Véhicules')).not.toBeInTheDocument();
    expect(screen.queryByText('Voyages')).not.toBeInTheDocument();
    expect(screen.getByText('Réservation')).toBeInTheDocument();
    expect(screen.getByText('Préférences')).toBeInTheDocument();
  });
});
