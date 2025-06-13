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

vi.mock('../../../components/trip/TripList', () => ({
  TripList: () => <div data-testid="trip-list">TripList mock</div>,
}));

describe('DashboardListSwitch', () => {
  const mockSetVehicleMode = vi.fn();
  const mockSetSelectedVehicle = vi.fn();
  const mockSetPreferencesMode = vi.fn();
  const mockSetTripMode = vi.fn();
  const mockSetSelectedTrip = vi.fn();

  it('renders VehicleList when profileTabs is "vehicle"', () => {
    render(
      <DashboardListSwitch
        profileTabs="vehicle"
        onSetPreferencesMode={mockSetPreferencesMode}
        onSetVehicleMode={mockSetVehicleMode}
        onSetSelectedVehicle={mockSetSelectedVehicle}
        onSetTripMode={mockSetTripMode}
        onSetSelectedTrip={mockSetSelectedTrip}
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
        onSetTripMode={mockSetTripMode}
        onSetSelectedTrip={mockSetSelectedTrip}
      />
    );

    expect(screen.getByTestId('preferences-view')).toBeInTheDocument();
  });

  it('renders TripList when profileTabs is "trip"', () => {
    render(
      <DashboardListSwitch
        profileTabs="trip"
        onSetPreferencesMode={vi.fn()}
        onSetVehicleMode={mockSetVehicleMode}
        onSetSelectedVehicle={mockSetSelectedVehicle}
        onSetTripMode={mockSetTripMode}
        onSetSelectedTrip={mockSetSelectedTrip}
      />
    );

    expect(screen.getByTestId('trip-list')).toBeInTheDocument();
  });

  it('renders fallback text for other tabs', () => {
    render(
      <DashboardListSwitch
        profileTabs="booking"
        onSetPreferencesMode={mockSetPreferencesMode}
        onSetVehicleMode={mockSetVehicleMode}
        onSetSelectedVehicle={mockSetSelectedVehicle}
        onSetTripMode={mockSetTripMode}
        onSetSelectedTrip={mockSetSelectedTrip}
      />
    );

    expect(
      screen.getByText("Vous n'avez encore enregistré aucun booking.")
    ).toBeInTheDocument();
  });
});
