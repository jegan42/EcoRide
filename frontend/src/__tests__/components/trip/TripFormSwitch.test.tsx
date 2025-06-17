// frontend/src/__tests__/components/trip/TripFormSwitch.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TripFormSwitch } from '../../../components/trip/TripFormSwitch';
import { vi } from 'vitest';
import type { Trip, TripStatus } from '../../../types/trip';
import authReducer from '../../../store/slices/authSlice';
import * as useProfileHook from '../../../hooks/useProfile';
import * as useTripHook from '../../../hooks/useTrip';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

vi.mock('../../../components/trip/TripForm', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TripForm: ({ onSubmit, onCancel }: any) => (
    <div>
      <button onClick={() => onSubmit({ mock: 'data' })}>SubmitForm</button>
      <button onClick={onCancel}>CancelForm</button>
    </div>
  ),
}));

describe('TripFormSwitch', () => {
  const mockUser = { id: 'user-1', name: 'John Doe' };

  beforeEach(() => {
    vi.spyOn(useProfileHook, 'useProfile').mockReturnValue({
      user: mockUser,
      isDriver: false,
      isSubmitting: false,
      onUpdateUser: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('displays the form to add a trip if tripMode = "add"', () => {
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
    const onSetTripMode = vi.fn();

    const { container } = render(
      <Provider store={store}>
        <TripFormSwitch
          tripMode="add"
          isSubmitting={false}
          selectedTrip={null}
          onSetTripMode={onSetTripMode}
        />
      </Provider>
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText('Ajouter un Voyage')).toBeInTheDocument();
    fireEvent.click(screen.getByText('CancelForm'));
    expect(onSetTripMode).toHaveBeenCalledWith('view');
  });

  it('submit the form in mode "add"', async () => {
    const onSetTripMode = vi.fn();
    const onCreateTrip = vi.fn().mockResolvedValue(true);
    vi.spyOn(useTripHook, 'useTrip').mockReturnValue({
      onCreateTrip,
      onUpdateTrip: vi.fn(),
      allTrips: [],
      trips: [],
      selectedTrip: null,
      loading: false,
      error: null,
      isSubmitting: false,
      fetchTrips: vi.fn(),
      fetchTripById: vi.fn(),
      onCancelTrip: vi.fn(),
    });

    render(
      <TripFormSwitch
        tripMode="add"
        isSubmitting={false}
        selectedTrip={null}
        onSetTripMode={onSetTripMode}
      />
    );

    fireEvent.click(screen.getByText('SubmitForm'));

    await waitFor(() => {
      expect(onCreateTrip).toHaveBeenCalledWith({ mock: 'data' });
      expect(onSetTripMode).toHaveBeenCalledWith('view');
    });
  });

  it('displays the form to modify a trip if tripMode = "edit"', () => {
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
    const onSetTripMode = vi.fn();
    const selectedTrip: Trip = {
      id: 'trip-123',
      driverId: 'user-1',
      vehicleId: 'v1',
      departureCity: 'Paris',
      arrivalCity: 'Lyon',
      departureDate: new Date().toISOString(),
      arrivalDate: new Date().toISOString(),
      availableSeats: 3,
      price: 20,
      status: 'open' as TripStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    render(
      <Provider store={store}>
        <TripFormSwitch
          tripMode="edit"
          isSubmitting={false}
          selectedTrip={{
            ...selectedTrip,
            status: selectedTrip.status as TripStatus,
          }}
          onSetTripMode={onSetTripMode}
        />
      </Provider>
    );

    expect(screen.getByText('Modifier un Voyage')).toBeInTheDocument();
    fireEvent.click(screen.getByText('CancelForm'));
    expect(onSetTripMode).toHaveBeenCalledWith('view');
  });

  it('submit the form in mode "edit"', async () => {
    const onSetTripMode = vi.fn();
    const onUpdateTrip = vi.fn().mockResolvedValue(true);
    const selectedTrip: Trip = {
      id: 'trip-123',
      driverId: 'user-1',
      vehicleId: 'v1',
      departureCity: 'Paris',
      arrivalCity: 'Lyon',
      departureDate: new Date().toISOString(),
      arrivalDate: new Date().toISOString(),
      availableSeats: 3,
      price: 20,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    vi.spyOn(useTripHook, 'useTrip').mockReturnValue({
      onCreateTrip: vi.fn(),
      onUpdateTrip,
      allTrips: [],
      trips: [],
      selectedTrip: null,
      loading: false,
      error: null,
      isSubmitting: false,
      fetchTrips: vi.fn(),
      fetchTripById: vi.fn(),
      onCancelTrip: vi.fn(),
    });

    render(
      <TripFormSwitch
        tripMode="edit"
        isSubmitting={false}
        selectedTrip={{
          ...selectedTrip,
          status: selectedTrip.status as TripStatus,
        }}
        onSetTripMode={onSetTripMode}
      />
    );

    fireEvent.click(screen.getByText('SubmitForm'));

    await waitFor(() => {
      expect(onUpdateTrip).toHaveBeenCalledWith('trip-123', { mock: 'data' });
      expect(onSetTripMode).toHaveBeenCalledWith('view');
    });
  });

  it('returns nothing if tripMode invalid or data missing', () => {
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

    const { container } = render(
      <Provider store={store}>
        <TripFormSwitch
          tripMode="view"
          isSubmitting={false}
          selectedTrip={null}
          onSetTripMode={vi.fn()}
        />
      </Provider>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('changes the mode to "view" if onCreateTrip succeeds', async () => {
    const onSetTripMode = vi.fn();
    const onCreateTrip = vi.fn().mockResolvedValue(true);
    vi.spyOn(useTripHook, 'useTrip').mockReturnValue({
      onCreateTrip,
      onUpdateTrip: vi.fn(),
      allTrips: [],
      trips: [],
      selectedTrip: null,
      loading: false,
      error: null,
      isSubmitting: false,
      fetchTrips: vi.fn(),
      fetchTripById: vi.fn(),
      onCancelTrip: vi.fn(),
    });

    render(
      <TripFormSwitch
        tripMode="add"
        isSubmitting={false}
        selectedTrip={null}
        onSetTripMode={onSetTripMode}
      />
    );

    fireEvent.click(screen.getByText('SubmitForm'));

    await waitFor(() => {
      expect(onCreateTrip).toHaveBeenCalled();
      expect(onSetTripMode).toHaveBeenCalledWith('view');
    });
  });

  it('do not change the mode if onCreateTrip fails', async () => {
    const onSetTripMode = vi.fn();
    const onCreateTrip = vi.fn().mockResolvedValue(false);
    vi.spyOn(useTripHook, 'useTrip').mockReturnValue({
      onCreateTrip,
      onUpdateTrip: vi.fn(),
      allTrips: [],
      trips: [],
      selectedTrip: null,
      loading: false,
      error: null,
      isSubmitting: false,
      fetchTrips: vi.fn(),
      fetchTripById: vi.fn(),
      onCancelTrip: vi.fn(),
    });

    render(
      <TripFormSwitch
        tripMode="add"
        isSubmitting={false}
        selectedTrip={null}
        onSetTripMode={onSetTripMode}
      />
    );

    fireEvent.click(screen.getByText('SubmitForm'));

    await waitFor(() => {
      expect(onCreateTrip).toHaveBeenCalled();
      expect(onSetTripMode).not.toHaveBeenCalled();
    });
  });

  it('changes the mode to "view" if onUpdateTrip succeeds', async () => {
    const onSetTripMode = vi.fn();
    const onUpdateTrip = vi.fn().mockResolvedValue(true);
    const selectedTrip = {
      id: 'trip-123',
      driverId: 'user-1',
      vehicleId: 'v1',
      departureCity: 'Paris',
      arrivalCity: 'Lyon',
      departureDate: new Date().toISOString(),
      arrivalDate: new Date().toISOString(),
      availableSeats: 3,
      price: 20,
      status: 'open' as TripStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    vi.spyOn(useTripHook, 'useTrip').mockReturnValue({
      onCreateTrip: vi.fn(),
      onUpdateTrip,
      allTrips: [],
      trips: [],
      selectedTrip: null,
      loading: false,
      error: null,
      isSubmitting: false,
      fetchTrips: vi.fn(),
      fetchTripById: vi.fn(),
      onCancelTrip: vi.fn(),
    });

    render(
      <TripFormSwitch
        tripMode="edit"
        isSubmitting={false}
        selectedTrip={selectedTrip}
        onSetTripMode={onSetTripMode}
      />
    );

    fireEvent.click(screen.getByText('SubmitForm'));

    await waitFor(() => {
      expect(onUpdateTrip).toHaveBeenCalled();
      expect(onSetTripMode).toHaveBeenCalledWith('view');
    });
  });

  it('do not change the mode if onUpdateTrip fails', async () => {
    const onSetTripMode = vi.fn();
    const onUpdateTrip = vi.fn().mockResolvedValue(false);
    const selectedTrip = {
      id: 'trip-123',
      driverId: 'user-1',
      vehicleId: 'v1',
      departureCity: 'Paris',
      arrivalCity: 'Lyon',
      departureDate: new Date().toISOString(),
      arrivalDate: new Date().toISOString(),
      availableSeats: 3,
      price: 20,
      status: 'open' as TripStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    vi.spyOn(useTripHook, 'useTrip').mockReturnValue({
      onCreateTrip: vi.fn(),
      onUpdateTrip,
      allTrips: [],
      trips: [],
      selectedTrip: null,
      loading: false,
      error: null,
      isSubmitting: false,
      fetchTrips: vi.fn(),
      fetchTripById: vi.fn(),
      onCancelTrip: vi.fn(),
    });

    render(
      <TripFormSwitch
        tripMode="edit"
        isSubmitting={false}
        selectedTrip={selectedTrip}
        onSetTripMode={onSetTripMode}
      />
    );

    fireEvent.click(screen.getByText('SubmitForm'));

    await waitFor(() => {
      expect(onUpdateTrip).toHaveBeenCalled();
      expect(onSetTripMode).not.toHaveBeenCalled();
    });
  });
});
