// frontend/src/__tests__/hooks/useDashboardState.test.tsx
import { renderHook } from '@testing-library/react';
import { act, type SetStateAction } from 'react';
import { useDashboardState } from '../../hooks/useDashboardState';
import type { Vehicle } from '../../types/vehicle';

describe('useDashboardState', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useDashboardState());

    expect(result.current.profileMode).toBe('view');
    expect(result.current.vehicleMode).toBe('view');
    expect(result.current.selectedVehicle).toBe(null);
    expect(result.current.profileTabs).toBe('preference');
    expect(result.current.isViewMode).toBe(true);
  });

  it('can update modes and selectedVehicle', () => {
    const { result } = renderHook(() => useDashboardState());

    act(() => {
      result.current.setProfileMode('edit');
      result.current.setVehicleMode('add');
      result.current.setProfileTabs('vehicle');
      result.current.setSelectedVehicle({
        id: '1',
        userId: 'u1',
        brand: 'Renault',
        model: 'Clio',
        color: 'Bleu',
        vehicleYear: 2022,
        licensePlate: 'AB-123-CD',
        energy: 'diesel',
        seatCount: 5,
        createdAt: '',
        updatedAt: '',
      });
    });

    expect(result.current.profileMode).toBe('edit');
    expect(result.current.vehicleMode).toBe('add');
    expect(result.current.profileTabs).toBe('vehicle');
    expect(result.current.selectedVehicle?.brand).toBe('Renault');
    expect(result.current.isViewMode).toBe(false);
  });

  it('resetModes resets all state', () => {
    const { result } = renderHook(() => useDashboardState());

    act(() => {
      result.current.setProfileMode('edit');
      result.current.setVehicleMode('edit');
      result.current.setProfileTabs('vehicle');
      result.current.setSelectedVehicle({} as SetStateAction<Vehicle | null>);
      result.current.resetModes();
    });

    expect(result.current.profileMode).toBe('view');
    expect(result.current.vehicleMode).toBe('view');
    expect(result.current.selectedVehicle).toBe(null);
    expect(result.current.profileTabs).toBe('preference');
    expect(result.current.isViewMode).toBe(true);
  });
});
