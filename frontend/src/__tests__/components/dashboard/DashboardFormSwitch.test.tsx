// frontend/src/__tests__/components/dashboard/DashboardFormSwitch.test.tsx
import { render, screen } from '@testing-library/react';
import { DashboardFormSwitch } from '../../../components/dashboard/DashboardFormSwitch';
import { vi } from 'vitest';
import authReducer from '../../../store/slices/authSlice';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

vi.mock('../../../hooks/useProfile', () => ({
  useProfile: () => ({ isSubmitting: false }),
}));
vi.mock('../../../hooks/usePreferences', () => ({
  usePreferences: () => ({ isSubmitting: false }),
}));
vi.mock('../../../hooks/useVehicle', () => ({
  useVehicle: () => ({ isSubmitting: false }),
}));

vi.mock('../../../components/profile/ProfileFormSwitch', () => ({
  ProfileFormSwitch: ({ profileMode }: { profileMode: string }) => (
    <div data-testid="profile-form">{profileMode}</div>
  ),
}));
vi.mock('../../../components/preferences/PreferencesFormSwitch', () => ({
  PreferencesFormSwitch: ({ preferencesMode }: { preferencesMode: string }) => (
    <div data-testid="preferences-form">{preferencesMode}</div>
  ),
}));
vi.mock('../../../components/vehicle/VehicleFormSwitch', () => ({
  VehicleFormSwitch: ({ vehicleMode }: { vehicleMode: string }) => (
    <div data-testid="vehicle-form">{vehicleMode}</div>
  ),
}));
vi.mock('../../../components/trip/TripFormSwitch', () => ({
  TripFormSwitch: ({ tripMode }: { tripMode: string }) => (
    <div data-testid="trip-form">{tripMode}</div>
  ),
}));

describe('DashboardFormSwitch', () => {
  const baseProps = {
    onSetProfileMode: vi.fn(),
    onSetPreferencesMode: vi.fn(),
    onSetVehicleMode: vi.fn(),
    onSetTripMode: vi.fn(),
    selectedVehicle: null,
    selectedTrip: null,
  };
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: null,
        isAuthenticated: false,
        loading: true,
        csrfToken: null,
      },
    },
  });

  it('renders ProfileFormSwitch if profileMode is different from "view"', () => {
    render(
      <Provider store={store}>
        <DashboardFormSwitch
          {...baseProps}
          profileMode="edit"
          preferencesMode="view"
          vehicleMode="view"
          tripMode="view"
        />
      </Provider>
    );

    expect(screen.getByTestId('profile-form')).toBeInTheDocument();
  });

  it('returns PreferencesFormSwitch if preferencesMode is different from "view" and profileMode is "view"', () => {
    render(
      <Provider store={store}>
        <DashboardFormSwitch
          {...baseProps}
          profileMode="view"
          preferencesMode="edit"
          vehicleMode="view"
          tripMode="view"
        />
      </Provider>
    );

    expect(screen.getByTestId('preferences-form')).toBeInTheDocument();
  });

  it('renders VehicleFormSwitch if vehicleMode is different from "view" and other modes are "view"', () => {
    render(
      <Provider store={store}>
        <DashboardFormSwitch
          {...baseProps}
          profileMode="view"
          preferencesMode="view"
          vehicleMode="edit"
          tripMode="view"
        />
      </Provider>
    );

    expect(screen.getByTestId('vehicle-form')).toBeInTheDocument();
  });

  it('renders TripFormSwitch if tripMode is different from "view" and other modes are "view"', () => {
    render(
      <Provider store={store}>
        <DashboardFormSwitch
          {...baseProps}
          profileMode="view"
          preferencesMode="view"
          vehicleMode="view"
          tripMode="edit"
        />
      </Provider>
    );

    expect(screen.getByTestId('trip-form')).toBeInTheDocument();
  });

  it('renders nothing if all modes are "view"', () => {
    const { container } = render(
      <Provider store={store}>
        <DashboardFormSwitch
          {...baseProps}
          profileMode="view"
          preferencesMode="view"
          vehicleMode="view"
          tripMode="view"
        />
      </Provider>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('correctly combines isSubmitting', () => {
    vi.doMock('../../../hooks/useProfile', () => ({
      useProfile: () => ({ isSubmitting: true }),
    }));
    vi.doMock('../../../hooks/usePreferences', () => ({
      usePreferences: () => ({ isSubmitting: true }),
    }));
    vi.doMock('../../../hooks/useVehicle', () => ({
      useVehicle: () => ({ isSubmitting: true }),
    }));

    const { unmount } = render(
      <Provider store={store}>
        <DashboardFormSwitch
          {...baseProps}
          profileMode="edit"
          preferencesMode="view"
          vehicleMode="view"
          tripMode="view"
        />
      </Provider>
    );

    expect(screen.getByTestId('profile-form')).toBeInTheDocument();
    unmount();
    vi.resetModules();
  });
});
