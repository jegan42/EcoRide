// tests/__tests__/hooks/useFilterVehicle.test.ts
import { renderHook, act } from '@testing-library/react';
import { useFilterVehicle } from '../../hooks/useFilterVehicle';
import type { Vehicle } from '../../types/vehicle';

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    userId: 'u1',
    brand: 'Tesla',
    model: 'Model 3',
    color: 'White',
    vehicleYear: 2022,
    licensePlate: 'ABC-123',
    energy: 'electric',
    seatCount: 5,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z',
  },
  {
    id: '2',
    userId: 'u2',
    brand: 'Toyota',
    model: 'Prius',
    color: 'Blue',
    vehicleYear: 2019,
    licensePlate: 'XYZ-456',
    energy: 'hybrid',
    seatCount: 4,
    createdAt: '2022-01-01T00:00:00.000Z',
    updatedAt: '2022-01-03T00:00:00.000Z',
  },
];

describe('useFilterVehicle', () => {
  it('filter vehicles by energy', () => {
    const { result } = renderHook(() => useFilterVehicle(mockVehicles));

    act(() => {
      result.current.setEnergyFilter('electric');
    });

    expect(result.current.filteredVehicles).toHaveLength(1);
    expect(result.current.filteredVehicles[0]?.energy).toBe('electric');
  });

  it('filter vehicles by number of seats', () => {
    const { result } = renderHook(() => useFilterVehicle(mockVehicles));

    act(() => {
      result.current.setSeatFilter(4);
    });

    expect(result.current.filteredVehicles).toHaveLength(1);
    expect(result.current.filteredVehicles[0]?.seatCount).toBe(4);
  });

  it('sorting vehicles by year (vehicleYear)', () => {
    const { result } = renderHook(() => useFilterVehicle(mockVehicles));

    act(() => {
      result.current.setSortKey('year');
      result.current.setSortOrder('asc');
    });

    expect(result.current.filteredVehicles[0]?.vehicleYear).toBe(2019);
    expect(result.current.filteredVehicles[1]?.vehicleYear).toBe(2022);
  });

  it('sort vehicles by update date (updatedAt)', () => {
    const { result } = renderHook(() => useFilterVehicle(mockVehicles));

    act(() => {
      result.current.setSortKey('updatedAt');
      result.current.setSortOrder('asc');
    });

    expect(result.current.filteredVehicles[0]?.updatedAt).toBe(
      '2022-01-03T00:00:00.000Z'
    );
    expect(result.current.filteredVehicles[1]?.updatedAt).toBe(
      '2023-01-02T00:00:00.000Z'
    );
  });

  it('sorting vehicles by number of seats (seatCount)', () => {
    const { result } = renderHook(() => useFilterVehicle(mockVehicles));

    act(() => {
      result.current.setSortKey('seatCount');
      result.current.setSortOrder('asc');
    });

    expect(result.current.filteredVehicles[0]?.seatCount).toBe(4);
    expect(result.current.filteredVehicles[1]?.seatCount).toBe(5);
  });

  it('reset the filters correctly', () => {
    const { result } = renderHook(() => useFilterVehicle(mockVehicles));

    act(() => {
      result.current.setEnergyFilter('hybrid');
      result.current.setSeatFilter(4);
      result.current.setSortKey('year');
      result.current.setSortOrder('asc');
    });

    expect(result.current.filteredVehicles).toHaveLength(1);

    act(() => {
      result.current.resetfilters();
    });

    expect(result.current.energyFilter).toBe('');
    expect(result.current.seatFilter).toBe('');
    expect(result.current.sortKey).toBe('addedAt');
    expect(result.current.sortOrder).toBe('desc');
    expect(result.current.filteredVehicles).toHaveLength(2);
  });

  it('ignores invalid elements (undefined or null) when sorting', () => {
    const vehiclesWithNulls = [
      undefined,
      null,
      {
        id: '1',
        userId: 'u1',
        brand: 'Tesla',
        model: 'Model 3',
        color: 'White',
        vehicleYear: 2022,
        licensePlate: 'ABC-123',
        energy: 'electric',
        seatCount: 5,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      },
    ] as Vehicle[];

    const { result } = renderHook(() => useFilterVehicle(vehiclesWithNulls));

    act(() => {
      result.current.setSortKey('year');
      result.current.setSortOrder('asc');
    });

    expect(result.current.filteredVehicles).toHaveLength(1);
    expect(result.current.filteredVehicles[0]?.brand).toBe('Tesla');
  });
});
