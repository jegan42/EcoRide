// frontend/src/__test__/pages/Dashboard.tsx
import { render, screen } from '@testing-library/react';
import DashboardPage from '../../pages/Dashboard';
import * as useProfileHook from '../../hooks/useProfile';
import * as useVehicleHook from '../../hooks/useVehicle';
import * as useModesHook from '../../hooks/useModes';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

interface MockProfileViewProps {
  onSetProfileMode: () => void;
  onSetVehicleMode: () => void;
}
vi.mock('notistack', () => {
  return {
    enqueueSnackbar: vi.fn(),
  };
});
vi.mock('../../hooks/useProfile');
vi.mock('../../hooks/useVehicle');
vi.mock('../../hooks/useModes');
vi.mock('../../components/profile/ProfileView', () => {
  return {
    ProfileView: ({
      onSetProfileMode,
      onSetVehicleMode,
    }: MockProfileViewProps) => (
      <div data-testid="profile-view">
        <button
          onClick={() => onSetProfileMode()}
          data-testid="btn-profile-mode"
        />
        <button
          onClick={() => onSetVehicleMode()}
          data-testid="btn-vehicle-mode"
        />
      </div>
    ),
  };
});

vi.mock('../../components/dashboard/DashboardListSwitch', () => ({
  DashboardListSwitch: () => <div data-testid="dashboard-list-switch" />,
}));

describe('DashboardPage', () => {
  const store = configureStore({ reducer: () => ({ auth: { user: null } }) });
  const renderWithProvider = (
    ui: React.ReactElement
  ): ReturnType<typeof render> => {
    return render(<Provider store={store}>{ui}</Provider>);
  };
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays an error message if isDriver=true and error exists', () => {
    (useProfileHook.useProfile as jest.Mock).mockReturnValue({
      isDriver: true,
    });
    (useVehicleHook.useVehicle as jest.Mock).mockReturnValue({
      loading: false,
      error: 'Erreur critique',
    });
    (useModesHook.useModes as jest.Mock).mockReturnValue({
      profileMode: 'view',
      setProfileMode: vi.fn(),
      vehicleMode: 'view',
      setVehicleMode: vi.fn(),
      selectedVehicle: null,
      setSelectedVehicle: vi.fn(),
      profileTabs: 0,
      setProfileTabs: vi.fn(),
      isViewMode: true,
    });

    render(<DashboardPage />);

    expect(screen.getByText('Erreur critique')).toBeInTheDocument();
  });

  it('displays ProfileLoading if loading is true', () => {
    (useProfileHook.useProfile as jest.Mock).mockReturnValue({
      isDriver: false,
    });
    (useVehicleHook.useVehicle as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
    });
    (useModesHook.useModes as jest.Mock).mockReturnValue({
      profileMode: 'view',
      setProfileMode: vi.fn(),
      vehicleMode: 'view',
      setVehicleMode: vi.fn(),
      selectedVehicle: null,
      setSelectedVehicle: vi.fn(),
      profileTabs: 0,
      setProfileTabs: vi.fn(),
      isViewMode: true,
    });

    render(<DashboardPage />);

    const avatar = screen.getByTestId('skeleton-avatar');
    expect(avatar).toBeInTheDocument();
    const headingSkeleton = screen.getByText((_, node) => {
      return node?.tagName === 'H5';
    });
    expect(headingSkeleton).toBeInTheDocument();
    const username = screen.getByTestId('skeleton-username');
    expect(username).toBeInTheDocument();
    const lines = screen.getAllByTestId('skeleton-info');
    expect(lines).toHaveLength(5);
  });

  it('correctly renders the dashboard when there is no error or loading', () => {
    (useProfileHook.useProfile as jest.Mock).mockReturnValue({
      isDriver: false,
    });
    (useVehicleHook.useVehicle as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
    });
    (useModesHook.useModes as jest.Mock).mockReturnValue({
      profileMode: 'view',
      setProfileMode: vi.fn(),
      vehicleMode: 'view',
      setVehicleMode: vi.fn(),
      selectedVehicle: null,
      setSelectedVehicle: vi.fn(),
      profileTabs: 0,
      setProfileTabs: vi.fn(),
      isViewMode: true,
    });

    renderWithProvider(<DashboardPage />);

    expect(screen.getByText('Mon Tableau de Bord')).toBeInTheDocument();

    expect(screen.queryByTestId('profile-view')).toBeInTheDocument();
    expect(screen.queryByTestId('dashboard-list-switch')).toBeInTheDocument();
  });

  it('does not render ProfileView and DashboardListSwitch when isViewMode is false', () => {
    (useProfileHook.useProfile as jest.Mock).mockReturnValue({
      isDriver: false,
    });
    (useVehicleHook.useVehicle as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
    });
    (useModesHook.useModes as jest.Mock).mockReturnValue({
      profileMode: 'view',
      setProfileMode: vi.fn(),
      vehicleMode: 'view',
      setVehicleMode: vi.fn(),
      selectedVehicle: null,
      setSelectedVehicle: vi.fn(),
      profileTabs: 0,
      setProfileTabs: vi.fn(),
      isViewMode: false,
    });

    renderWithProvider(<DashboardPage />);

    expect(screen.queryByText('Mon Tableau de Bord')).toBeInTheDocument();
    expect(screen.queryByTestId('profile-view')).not.toBeInTheDocument();

    expect(
      screen.queryByTestId('dashboard-list-switch')
    ).not.toBeInTheDocument();

    expect(screen.queryByTestId('profile-view')).not.toBeInTheDocument();
  });

  it('renders ProfileView and DashboardListSwitch when isViewMode is true', () => {
    (useProfileHook.useProfile as jest.Mock).mockReturnValue({
      isDriver: false,
    });
    (useVehicleHook.useVehicle as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
    });
    (useModesHook.useModes as jest.Mock).mockReturnValue({
      profileMode: 'view',
      setProfileMode: vi.fn(),
      vehicleMode: 'view',
      setVehicleMode: vi.fn(),
      selectedVehicle: null,
      setSelectedVehicle: vi.fn(),
      profileTabs: 0,
      setProfileTabs: vi.fn(),
      isViewMode: true,
    });

    renderWithProvider(<DashboardPage />);

    expect(screen.getByTestId('profile-view')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-list-switch')).toBeInTheDocument();
  });

  it('calls onSetProfileMode and onSetVehicleMode callbacks', () => {
    const setProfileModeMock = vi.fn();
    const setVehicleModeMock = vi.fn();

    (useProfileHook.useProfile as jest.Mock).mockReturnValue({
      isDriver: false,
    });
    (useVehicleHook.useVehicle as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
    });
    (useModesHook.useModes as jest.Mock).mockReturnValue({
      profileMode: 'view',
      setProfileMode: setProfileModeMock,
      vehicleMode: 'view',
      setVehicleMode: setVehicleModeMock,
      selectedVehicle: null,
      setSelectedVehicle: vi.fn(),
      profileTabs: 0,
      setProfileTabs: vi.fn(),
      isViewMode: true,
    });

    renderWithProvider(<DashboardPage />);

    const btnProfileMode = screen.getByTestId('btn-profile-mode');
    const btnVehicleMode = screen.getByTestId('btn-vehicle-mode');

    btnProfileMode.click();
    btnVehicleMode.click();

    expect(setProfileModeMock).toHaveBeenCalledWith('edit');
    expect(setVehicleModeMock).toHaveBeenCalledWith('add');
  });
});
