// frontend/src/__tests__/hooks/useFindTripFilters.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useFindTripFilters } from '../../hooks/useFindTripFilters';
import type { Trip } from '../../types/trip';
import type { Vehicle } from '../../types/vehicle';

describe('useFindTripFilters', () => {
  const trips: Partial<Trip & { vehicle?: Partial<Vehicle> }>[] = [
    {
      id: '1',
      departureCity: 'paris',
      arrivalCity: 'lyon',
      price: 25,
      availableSeats: 3,
      departureDate: '2023-01-01T00:00:00.000Z',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
      vehicle: { energy: 'electric' },
    },
    {
      id: '2',
      departureCity: 'marseille',
      arrivalCity: 'nice',
      price: 45,
      availableSeats: 4,
      departureDate: '2022-01-01T00:00:00.000Z',
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-03T00:00:00.000Z',
      vehicle: { energy: 'diesel' },
    },
    {
      id: '3',
      departureCity: 'paris',
      arrivalCity: 'bordeaux',
      price: 15,
      availableSeats: 5,
      departureDate: '2024-01-01T00:00:00.000Z',
      createdAt: '2022-01-01T00:00:00.000Z',
      updatedAt: '2022-01-02T00:00:00.000Z',
      vehicle: { energy: 'hydrogen' },
    },
  ];
  const trips2: Partial<Trip & { vehicle?: Partial<Vehicle> }>[] = [
    {
      id: '1',
      departureCity: 'paris',
      arrivalCity: 'lyon',
      price: undefined,
      availableSeats: 3,
      departureDate: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      vehicle: { energy: undefined },
    },
    {
      id: '2',
      departureCity: 'marseille',
      arrivalCity: 'nice',
      price: 45,
      availableSeats: 5,
      vehicle: {},
    },
    {
      id: '3',
      departureCity: 'paris',
      arrivalCity: 'bordeaux',
      price: 15,
      availableSeats: 5,
      departureDate: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    },
  ];

  it('returns correct filtered trips initially', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    expect(result.current.filteredTrips.length).toBe(3);
    expect(result.current.departureCities.length).toEqual(2);
    expect(result.current.departureCities).toContain('marseille');
    expect(result.current.departureCities).toContain('paris');
    expect(result.current.arrivalCities.length).toEqual(3);
    expect(result.current.arrivalCities).toContain('bordeaux');
    expect(result.current.arrivalCities).toContain('nice');
    expect(result.current.arrivalCities).toContain('lyon');
  });

  it('filters by eco group correctly', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    act(() => {
      result.current.setEcoFilter('eco');
    });

    expect(result.current.filteredTrips.length).toBe(2);
  });

  it('filters by price range', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    act(() => {
      result.current.setPriceRange([20, 30]);
    });

    expect(result.current.filteredTrips).toHaveLength(1);
    expect(result.current.filteredTrips[0].id).toBe('1');
  });

  it('filters by availableSeats', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    act(() => {
      result.current.setSelectedSeats([4]);
    });

    expect(result.current.filteredTrips).toHaveLength(1);
    expect(result.current.filteredTrips[0].availableSeats).toBe(4);
  });

  it('sorts trips correctly by price ascending', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    act(() => {
      result.current.setSortKey('price');
      result.current.setSortOrder('asc');
    });

    const sortedIds = result.current.filteredTrips.map((t) => t.id);
    expect(sortedIds).toEqual(['3', '1', '2']);
  });

  it('resets filters correctly', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    act(() => {
      result.current.setEcoFilter('eco');
      result.current.setPriceRange([10, 20]);
      result.current.setSortKey('price');
    });

    expect(result.current.filteredTrips.length).toBe(1);

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filteredTrips.length).toBe(3);
    expect(result.current.sortKey).toBe('addedAt');
    expect(result.current.ecoFilter).toBe('');
  });

  it('sorts trips correctly by created date (addedAt)', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    act(() => {
      result.current.setSortKey('addedAt');
      result.current.setSortOrder('asc');
    });

    const sortedIds = result.current.filteredTrips.map((t) => t.id);
    expect(sortedIds).toEqual(['3', '1', '2']);
  });

  it('sorts trips correctly by update date (updatedAt)', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    act(() => {
      result.current.setSortKey('updatedAt');
      result.current.setSortOrder('asc');
    });

    const sortedIds = result.current.filteredTrips.map((t) => t.id);
    expect(sortedIds).toEqual(['3', '1', '2']);
  });

  it('sorts trips correctly by departureDate', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    act(() => {
      result.current.setSortKey('departureDate');
      result.current.setSortOrder('asc');
    });

    const sortedIds = result.current.filteredTrips.map((t) => t.id);
    expect(sortedIds).toEqual(['2', '1', '3']);
  });

  it('sorts trips correctly by availableSeats', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    act(() => {
      result.current.setSortKey('availableSeats');
      result.current.setSortOrder('desc');
    });

    const sortedIds = result.current.filteredTrips.map((t) => t.id);
    expect(sortedIds).toEqual(['3', '2', '1']);
  });

  it('sorts trips correctly by nothing', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    act(() => {
      result.current.setSortKey('nothing');
      result.current.setSortOrder('desc');
    });

    const sortedIds = result.current.filteredTrips.map((t) => t.id);
    expect(sortedIds).toEqual(['1', '2', '3']);
  });

  it('sorts trips correctly by created date (addedAt)', () => {
    const { result } = renderHook(() => useFindTripFilters(trips2));

    act(() => {
      result.current.setSortKey('addedAt');
      result.current.setSortOrder('asc');
    });

    const sortedIds = result.current.filteredTrips.map((t) => t.id);
    expect(sortedIds).toEqual(['2', '3']);
  });

  it('sorts trips correctly by update date (updatedAt)', () => {
    const { result } = renderHook(() => useFindTripFilters(trips2));

    act(() => {
      result.current.setSortKey('updatedAt');
      result.current.setSortOrder('asc');
    });

    const sortedIds = result.current.filteredTrips.map((t) => t.id);
    expect(sortedIds).toEqual(['2', '3']);
  });

  it('sorts trips correctly by departureDate', () => {
    const { result } = renderHook(() => useFindTripFilters(trips2));

    act(() => {
      result.current.setSortKey('departureDate');
      result.current.setSortOrder('asc');
    });

    const sortedIds = result.current.filteredTrips.map((t) => t.id);
    expect(sortedIds).toEqual(['2', '3']);
  });

  it('filters by eco group correctly', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    act(() => {
      result.current.setEcoFilter('eco');
    });

    expect(result.current.filteredTrips.length).toBe(2);
  });

  it('filters by price range', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    act(() => {
      result.current.setPriceRange([0, 10]);
    });

    expect(result.current.filteredTrips).toHaveLength(0);
  });

  it('filters trips within the specified price range', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    act(() => {
      result.current.setPriceRange([17, 40]);
    });

    const filtered = result.current.filteredTrips;

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });

  it('returns all trips when price range includes all prices', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    act(() => {
      result.current.setPriceRange([0, 100]);
    });

    const filtered = result.current.filteredTrips;

    expect(filtered).toHaveLength(3);
  });

  it('returns no trips if range excludes all prices', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    act(() => {
      result.current.setPriceRange([60, 100]);
    });

    const filtered = result.current.filteredTrips;

    expect(filtered).toHaveLength(0);
  });

  it('returns no trips if range undefined include all prices', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    act(() => {
      result.current.setPriceRange(undefined as unknown as [number, number]);
    });

    const filtered = result.current.filteredTrips;

    expect(filtered).toHaveLength(3);
  });

  it('filters trips with 5 or more available seats when selectedSeats includes 5', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    act(() => {
      result.current.setSelectedSeats([5]);
    });

    const filtered = result.current.filteredTrips;

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('3');
  });

  it('counts available seats correctly for positive seat numbers', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    expect(result.current.seatCounts).toEqual({
      3: 1,
      4: 1,
      5: 1,
    });
  });

  it('ignores trips with 0 or undefined availableSeats when counting seats', () => {
    const noSeatsTrips = [
      { id: 'a', availableSeats: 0 },
      { id: 'b' },
      { id: 'c', availableSeats: -1 },
    ];

    const { result } = renderHook(() => useFindTripFilters(noSeatsTrips));

    expect(result.current.seatCounts).toEqual({});
  });

  it('ignores trips with 0 or undefined availableSeats when counting seats', () => {
    const { result } = renderHook(() => useFindTripFilters(trips2));

    expect(result.current.seatCounts).toEqual({
      5: 2,
    });
  });

  it('computes ecoCounts correctly for known fuel types', () => {
    const { result } = renderHook(() => useFindTripFilters(trips));

    expect(result.current.ecoCounts).toEqual({
      eco: 2,
      notEco: 1,
    });
  });

  it('skips ecoCounts processing when vehicle.energy is undefined', () => {
    const { result } = renderHook(() => useFindTripFilters(trips2));

    expect(result.current.ecoCounts).toEqual({});
  });
});
