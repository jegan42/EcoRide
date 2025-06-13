// frontend/src/__tests__/components/trip/TripList.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

vi.mock('../../../hooks/useTrip');

vi.mock('../../../hooks/useFilterTrip');

vi.mock('../../../components/trip/TripInfo', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TripInfo: ({ trip, onEdit, onDelete }: any) => (
    <div data-testid="trip-info">
      {trip?.departureCity} → {trip?.arrivalCity}
      <button onClick={onEdit}>Modifier</button>
      <button onClick={() => onDelete(trip.id)}>Supprimer</button>
    </div>
  ),
}));

import { TripList } from '../../../components/trip/TripList';
import { useTrip } from '../../../hooks/useTrip';
import { useFilterTrip } from '../../../hooks/useFilterTrip';

const mockTrip = {
  id: '1',
  departureCity: 'Paris',
  arrivalCity: 'Lyon',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  departureDate: new Date().toISOString(),
  arrivalDate: new Date().toISOString(),
  status: 'open',
  price: 42,
  availableSeats: 3,
  driverId: 'driver1',
  vehicleId: 'veh1',
  vehicle: {
    id: 'veh1',
    brand: 'Peugeot',
    energy: 'diesel',
  },
};

const baseUseTrip = {
  trips: [],
  error: 'Erreur de chargement',
  onCancelTrip: vi.fn(),
};

const baseUseFilterTrip = {
  filteredTrips: [],
  vehicleFilter: '',
  energyFilter: '',
  departureFilter: '',
  arrivalFilter: '',
  statusFilter: '',
  sortKey: 'addedAt',
  sortOrder: 'desc',
  setVehicleFilter: vi.fn(),
  setEnergyFilter: vi.fn(),
  setDepartureFilter: vi.fn(),
  setArrivalFilter: vi.fn(),
  setStatusFilter: vi.fn(),
  setSortKey: vi.fn(),
  setSortOrder: vi.fn(),
  resetfilters: vi.fn(),
};

beforeEach(() => {
  vi.resetModules();
});

describe('TripList - affichage erreur', () => {
  it('displays the error message and the Add Trip button', async () => {
    (useTrip as jest.Mock).mockReturnValue(baseUseTrip);
    (useFilterTrip as jest.Mock).mockReturnValue(baseUseFilterTrip);
    const onSetTripMode = vi.fn();
    const onSetSelectedTrip = vi.fn();

    render(
      <TripList
        onSetTripMode={onSetTripMode}
        onSetSelectedTrip={onSetSelectedTrip}
      />
    );

    expect(screen.getByText(/Erreur de chargement/i)).toBeInTheDocument();

    const button = screen.getByRole('button', {
      name: /Ajouter un voyage/i,
    });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);
    expect(onSetTripMode).toHaveBeenCalledWith('add');
  });
});

describe('TripList with data', () => {
  it('displays available trips', () => {
    (useTrip as jest.Mock).mockReturnValue({
      ...baseUseTrip,
      trips: [mockTrip],
      error: null,
    });
    (useFilterTrip as jest.Mock).mockReturnValue({
      ...baseUseFilterTrip,
      filteredTrips: [mockTrip],
    });
    const onSetTripMode = vi.fn();
    const onSetSelectedTrip = vi.fn();

    render(
      <TripList
        onSetTripMode={onSetTripMode}
        onSetSelectedTrip={onSetSelectedTrip}
      />
    );

    expect(screen.getByText('Paris → Lyon')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Ajouter un voyage/i })
    ).toBeInTheDocument();
  });

  it('Add Trip display in the main section and triggers onSetTripMode("add")', async () => {
    const onSetTripMode = vi.fn();
    const onSetSelectedTrip = vi.fn();
    const onCancelTrip = vi.fn();

    (useTrip as jest.Mock).mockReturnValue({
      trips: [mockTrip],
      error: null,
      onCancelTrip,
    });

    (useFilterTrip as jest.Mock).mockReturnValue({
      ...baseUseFilterTrip,
      filteredTrips: [mockTrip],
    });

    render(
      <TripList
        onSetTripMode={onSetTripMode}
        onSetSelectedTrip={onSetSelectedTrip}
      />
    );

    const addButton = screen.getByRole('button', {
      name: /ajouter un voyage/i,
    });

    expect(addButton).toBeInTheDocument();

    await userEvent.click(addButton);

    expect(onSetTripMode).toHaveBeenCalledWith('add');
  });

  it('Filter trips without ID with SafeTrips', () => {
    const onSetTripMode = vi.fn();
    const onSetSelectedTrip = vi.fn();
    const onCancelTrip = vi.fn();

    const malformedTrip = {
      ...mockTrip,
      id: undefined,
    };

    (useTrip as jest.Mock).mockReturnValue({
      trips: [mockTrip, malformedTrip, null],
      error: null,
      onCancelTrip,
    });

    (useFilterTrip as jest.Mock).mockReturnValue({
      ...baseUseFilterTrip,
      filteredTrips: [mockTrip],
    });

    render(
      <TripList
        onSetTripMode={onSetTripMode}
        onSetSelectedTrip={onSetSelectedTrip}
      />
    );

    expect(screen.getAllByTestId('trip-info')).toHaveLength(1);
  });
});

describe('TripList - Add trip button in error block or empty filter', () => {
  it('calls onSetTripMode("add") when Add Trip is clicked', async () => {
    (useTrip as jest.Mock).mockReturnValue(baseUseTrip);
    (useFilterTrip as jest.Mock).mockReturnValue(baseUseFilterTrip);

    const onSetTripMode = vi.fn();
    const onSetSelectedTrip = vi.fn();

    render(
      <TripList
        onSetTripMode={onSetTripMode}
        onSetSelectedTrip={onSetSelectedTrip}
      />
    );

    const button = screen.getByRole('button', { name: /Ajouter un voyage/i });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    expect(onSetTripMode).toHaveBeenCalledWith('add');
  });

  it('Add a trip display when no trips match the filters (without error)', async () => {
    (useTrip as jest.Mock).mockReturnValue({
      trips: [mockTrip],
      error: null,
      onCancelTrip: vi.fn(),
    });

    (useFilterTrip as jest.Mock).mockReturnValue({
      ...baseUseFilterTrip,
      filteredTrips: [],
    });

    const onSetTripMode = vi.fn();
    const onSetSelectedTrip = vi.fn();

    render(
      <TripList
        onSetTripMode={onSetTripMode}
        onSetSelectedTrip={onSetSelectedTrip}
      />
    );

    expect(
      screen.getByText(/Aucun voyage ne correspond aux filtres sélectionnés/i)
    ).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /Ajouter un voyage/i });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);
    expect(onSetTripMode).toHaveBeenCalledWith('add');
  });
});

describe('TripList - onEdit and onDelete interactions', () => {
  it('calls onSetTripMode("edit") and onSetSelectedTrip when Edit is clicked', async () => {
    (useTrip as jest.Mock).mockReturnValue({
      trips: [mockTrip],
      error: null,
      onCancelTrip: vi.fn(),
    });

    (useFilterTrip as jest.Mock).mockReturnValue({
      ...baseUseFilterTrip,
      filteredTrips: [mockTrip],
    });

    const onSetTripMode = vi.fn();
    const onSetSelectedTrip = vi.fn();

    render(
      <TripList
        onSetTripMode={onSetTripMode}
        onSetSelectedTrip={onSetSelectedTrip}
      />
    );

    const modifyButton = screen.getByRole('button', { name: /Modifier/i });
    await userEvent.click(modifyButton);

    expect(onSetTripMode).toHaveBeenCalledWith('edit');
    expect(onSetSelectedTrip).toHaveBeenCalledWith(
      expect.objectContaining({
        id: mockTrip.id,
        departureCity: mockTrip.departureCity,
        arrivalCity: mockTrip.arrivalCity,
      })
    );
  });

  it('calls onCancelTrip when Delete is clicked', async () => {
    const mockOnCancelTrip = vi.fn();

    (useTrip as jest.Mock).mockReturnValue({
      trips: [mockTrip],
      error: null,
      onCancelTrip: mockOnCancelTrip,
    });

    (useFilterTrip as jest.Mock).mockReturnValue({
      ...baseUseFilterTrip,
      filteredTrips: [mockTrip],
    });

    const onSetTripMode = vi.fn();
    const onSetSelectedTrip = vi.fn();

    render(
      <TripList
        onSetTripMode={onSetTripMode}
        onSetSelectedTrip={onSetSelectedTrip}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /Supprimer/i });
    await userEvent.click(deleteButton);

    expect(mockOnCancelTrip).toHaveBeenCalledWith(mockTrip.id);
  });
});
