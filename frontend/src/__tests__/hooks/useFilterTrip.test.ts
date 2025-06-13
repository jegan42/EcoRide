// tests/__tests__/hooks/useFilterTrip.test.ts
import { renderHook, act } from '@testing-library/react';
import { useFilterTrip } from '../../hooks/useFilterTrip';
import type { Trip } from '../../types/trip';
import type { Vehicle } from '../../types/vehicle';
import type { User } from '../../types/user';

const mockTrips: (Partial<Trip> & {
  vehicle?: Partial<Vehicle>;
  driver?: Partial<User>;
})[] = [
  {
    id: '1',
    departureCity: 'Paris',
    arrivalCity: 'Lyon',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T10:00:00.000Z',
    departureDate: '2023-06-01T10:00:00.000Z',
    price: 30,
    availableSeats: 3,
    vehicle: {
      brand: 'Tesla',
      energy: 'electric',
    },
    status: 'open',
  },
  {
    id: '2',
    departureCity: 'Paris',
    arrivalCity: 'Lille',
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T10:00:00.000Z',
    departureDate: '2023-06-02T10:00:00.000Z',
    price: 20,
    availableSeats: 2,
    vehicle: {
      brand: 'Toyota',
      energy: 'diesel',
    },
    status: 'full',
  },
];

const mockTripsFailed: (Partial<Trip> & {
  vehicle?: Partial<Vehicle>;
  driver?: Partial<User>;
})[] = [
  {
    id: '1',
    departureCity: 'Paris',
    arrivalCity: 'Lyon',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T10:00:00.000Z',
    departureDate: '2023-06-01T10:00:00.000Z',
    price: 30,
    availableSeats: 3,
    vehicle: {
      brand: 'Tesla',
      energy: 'electric',
    },
    status: 'open',
  },
  {
    id: '2',
    departureCity: 'Paris',
    arrivalCity: 'Lille',
    createdAt: '123',
    updatedAt: '123',
    departureDate: '123',
    price: 20,
    availableSeats: 2,
    vehicle: {
      brand: 'Toyota',
      energy: 'diesel',
    },
    status: 'full',
  },
];

describe('useFilterTrip', () => {
  it('reset the filters correctly', () => {
    const { result } = renderHook(() => useFilterTrip(mockTrips));

    act(() => {
      result.current.setVehicleFilter('Tesla');
      result.current.setEnergyFilter('electric');
      result.current.setDepartureFilter('Paris');
      result.current.setArrivalFilter('Lyon');
      result.current.setStatusFilter('open');
      result.current.setSortKey('price');
      result.current.setSortOrder('asc');
    });

    expect(result.current.filteredTrips).toHaveLength(1);

    act(() => {
      result.current.resetfilters();
    });

    expect(result.current.vehicleFilter).toBe('');
    expect(result.current.energyFilter).toBe('');
    expect(result.current.departureFilter).toBe('');
    expect(result.current.arrivalFilter).toBe('');
    expect(result.current.statusFilter).toBe('');
    expect(result.current.sortKey).toBe('addedAt');
    expect(result.current.sortOrder).toBe('desc');
    expect(result.current.filteredTrips).toHaveLength(2);
  });

  it('should filter trips by vehicle brand', () => {
    const { result } = renderHook(() => useFilterTrip(mockTrips));

    act(() => {
      result.current.setVehicleFilter('Tesla');
    });

    expect(result.current.filteredTrips).toHaveLength(1);
    expect(result.current.filteredTrips[0]?.vehicle?.brand).toBe('Tesla');
  });

  it('should filter trips by vehicle energy', () => {
    const { result } = renderHook(() => useFilterTrip(mockTrips));

    act(() => {
      result.current.setEnergyFilter('diesel');
    });

    expect(result.current.filteredTrips).toHaveLength(1);
    expect(result.current.filteredTrips[0]?.vehicle?.energy).toBe('diesel');
  });

  it('ignores invalid elements (null ou undefined)', () => {
    const tripsWithInvalids = [
      null,
      undefined,
      {
        id: '1',
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        status: 'scheduled',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
        departureDate: '2023-01-05T00:00:00.000Z',
        price: 30,
        availableSeats: 3,
        vehicle: { brand: 'Renault' },
        driver: { id: 'u1', username: 'Alice' },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any;

    const { result } = renderHook(() => useFilterTrip(tripsWithInvalids));

    expect(result.current.filteredTrips).toHaveLength(1);
    expect(result.current.filteredTrips[0]?.departureCity).toBe('Paris');
  });

  it('sorting trips by addedAt (createdAt)', () => {
    const { result } = renderHook(() => useFilterTrip(mockTrips));

    act(() => {
      result.current.setSortKey('addedAt');
      result.current.setSortOrder('asc');
    });

    expect(result.current.filteredTrips[0]?.createdAt).toBe(
      '2023-01-01T00:00:00.000Z'
    );
    expect(result.current.filteredTrips[1]?.createdAt).toBe(
      '2023-01-02T00:00:00.000Z'
    );
  });

  it('sorting trips by updatedAt (updatedAt)', () => {
    const { result } = renderHook(() => useFilterTrip(mockTrips));

    act(() => {
      result.current.setSortKey('updatedAt');
      result.current.setSortOrder('asc');
    });

    expect(result.current.filteredTrips[0]?.updatedAt).toBe(
      '2023-01-01T10:00:00.000Z'
    );
    expect(result.current.filteredTrips[1]?.updatedAt).toBe(
      '2023-01-02T10:00:00.000Z'
    );
  });

  it('sorting trips by departureDate (departureDate)', () => {
    const { result } = renderHook(() => useFilterTrip(mockTrips));

    act(() => {
      result.current.setSortKey('departureDate');
      result.current.setSortOrder('asc');
    });

    expect(result.current.filteredTrips[0]?.departureDate).toBe(
      '2023-06-01T10:00:00.000Z'
    );
    expect(result.current.filteredTrips[1]?.departureDate).toBe(
      '2023-06-02T10:00:00.000Z'
    );
  });

  it('sorting trips by price (price)', () => {
    const { result } = renderHook(() => useFilterTrip(mockTrips));

    act(() => {
      result.current.setSortKey('price');
      result.current.setSortOrder('asc');
    });

    expect(result.current.filteredTrips[0]?.price).toBe(20);
    expect(result.current.filteredTrips[1]?.price).toBe(30);
  });

  it('sorting trips by availableSeats (availableSeats)', () => {
    const { result } = renderHook(() => useFilterTrip(mockTrips));

    act(() => {
      result.current.setSortKey('availableSeats');
      result.current.setSortOrder('asc');
    });

    expect(result.current.filteredTrips[0]?.availableSeats).toBe(2);
    expect(result.current.filteredTrips[1]?.availableSeats).toBe(3);
  });

  it('should return 0 when sorting with an unknown sort key', () => {
    const { result } = renderHook(() => useFilterTrip(mockTrips));

    act(() => {
      result.current.setSortKey('invalide');
      result.current.setSortOrder('asc');
    });

    expect(result.current.filteredTrips[0]?.id).toBe('1');
    expect(result.current.filteredTrips[1]?.id).toBe('2');
  });

  it('sorting trips by addedAt (createdAt)', () => {
    const { result } = renderHook(() => useFilterTrip(mockTripsFailed));

    act(() => {
      result.current.setSortKey('addedAt');
      result.current.setSortOrder('asc');
    });

    expect(result.current.filteredTrips[0]?.createdAt).toBe('123');
    expect(result.current.filteredTrips[1]?.createdAt).toBe(
      '2023-01-01T00:00:00.000Z'
    );
  });

  it('sorting trips by updatedAt (updatedAt)', () => {
    const { result } = renderHook(() => useFilterTrip(mockTripsFailed));

    act(() => {
      result.current.setSortKey('updatedAt');
      result.current.setSortOrder('asc');
    });

    expect(result.current.filteredTrips[0]?.updatedAt).toBe('123');
    expect(result.current.filteredTrips[1]?.updatedAt).toBe(
      '2023-01-01T10:00:00.000Z'
    );
  });

  it('sorting trips by departureDate (departureDate)', () => {
    const { result } = renderHook(() => useFilterTrip(mockTripsFailed));

    act(() => {
      result.current.setSortKey('departureDate');
      result.current.setSortOrder('asc');
    });

    expect(result.current.filteredTrips[0]?.departureDate).toBe('123');
    expect(result.current.filteredTrips[1]?.departureDate).toBe(
      '2023-06-01T10:00:00.000Z'
    );
  });
});
it('returns 0 if createdAt is false (addedAt)', () => {
  const trips = [
    { id: '1', createdAt: undefined },
    { id: '2', createdAt: '2023-01-01T00:00:00.000Z' },
  ] as Partial<Trip>[];

  const { result } = renderHook(() => useFilterTrip(trips));

  act(() => {
    result.current.setSortKey('addedAt');
    result.current.setSortOrder('asc');
  });

  expect(result.current.filteredTrips[0]?.id).toBe('1');
  expect(result.current.filteredTrips[1]?.id).toBe('2');
});

it('returns 0 if updatedAt is false (updatedAt)', () => {
  const trips = [
    { id: '1', updatedAt: undefined },
    { id: '2', updatedAt: '2023-01-02T00:00:00.000Z' },
  ] as Partial<Trip>[];

  const { result } = renderHook(() => useFilterTrip(trips));

  act(() => {
    result.current.setSortKey('updatedAt');
    result.current.setSortOrder('asc');
  });

  expect(result.current.filteredTrips[0]?.id).toBe('1');
  expect(result.current.filteredTrips[1]?.id).toBe('2');
});

it('returns 0 if departureDate is false (departureDate)', () => {
  const trips = [
    { id: '1', departureDate: null },
    { id: '2', departureDate: '2023-06-01T10:00:00.000Z' },
  ] as Partial<Trip>[];

  const { result } = renderHook(() => useFilterTrip(trips));

  act(() => {
    result.current.setSortKey('departureDate');
    result.current.setSortOrder('asc');
  });

  expect(result.current.filteredTrips[0]?.id).toBe('1');
  expect(result.current.filteredTrips[1]?.id).toBe('2');
});
