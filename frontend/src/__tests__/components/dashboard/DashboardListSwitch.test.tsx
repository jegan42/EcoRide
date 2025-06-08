// frontend/src/__tests__/components/dashboard/DashboardListSwitch.test.tsx
import { render, screen } from '@testing-library/react';
import { DashboardListSwitch } from '../../../components/dashboard/DashboardListSwitch';
import { vi } from 'vitest';

vi.mock('../../../components/vehicle/VehicleList', () => ({
  VehicleList: () => <div data-testid="vehicle-list">VehicleList mock</div>,
}));

vi.mock('../../../components/preferences/PreferencesView', () => ({
  PreferencesView: () => (
    <div data-testid="preferences-view">PreferencesView mock</div>
  ),
}));

describe('DashboardListSwitch', () => {
  const mockSetVehicleMode = vi.fn();
  const mockSetSelectedVehicle = vi.fn();
  const mockSetPreferencesMode = vi.fn();

  it('renders VehicleList when profileTabs is "vehicle"', () => {
    render(
      <DashboardListSwitch
        profileTabs="vehicle"
        onSetPreferencesMode={mockSetPreferencesMode}
        onSetVehicleMode={mockSetVehicleMode}
        onSetSelectedVehicle={mockSetSelectedVehicle}
      />
    );

    expect(screen.getByTestId('vehicle-list')).toBeInTheDocument();
  });

  it('renders PreferencesView when profileTabs is "preference"', () => {
    render(
      <DashboardListSwitch
        profileTabs="preference"
        onSetPreferencesMode={vi.fn()}
        onSetVehicleMode={mockSetVehicleMode}
        onSetSelectedVehicle={mockSetSelectedVehicle}
      />
    );

    expect(screen.getByTestId('preferences-view')).toBeInTheDocument();
  });

  it('renders fallback text for other tabs', () => {
    render(
      <DashboardListSwitch
        profileTabs="booking"
        onSetPreferencesMode={mockSetPreferencesMode}
        onSetVehicleMode={mockSetVehicleMode}
        onSetSelectedVehicle={mockSetSelectedVehicle}
      />
    );

    expect(
      screen.getByText("Vous n'avez encore enregistré aucun booking.")
    ).toBeInTheDocument();
  });
});
