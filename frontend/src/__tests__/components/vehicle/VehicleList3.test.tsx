// frontend/src/__tests__/components/vehicle/VehicleList3.test.tsx
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { useVehicle } from '../../../../src/hooks/useVehicle';
import { useFilterVehicle } from '../../../../src/hooks/useFilterVehicle';
import { VehicleList } from '../../../components/vehicle/VehicleList';

vi.mock('../../../hooks/useVehicle', () => ({
  useVehicle: vi.fn(),
}));

vi.mock('../../../hooks/useFilterVehicle', () => ({
  useFilterVehicle: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.resetModules();
});

describe('VehicleList', () => {
  it('handles filteredVehicles being undefined', () => {
    (useVehicle as jest.Mock).mockReturnValue({
      error: null,
      vehicles: [],
      onDeleteVehicle: vi.fn(),
    });

    (useFilterVehicle as jest.Mock).mockReturnValue({
      filteredVehicles: [],
      energyFilter: '',
      seatFilter: '',
      sortKey: '',
      sortOrder: 'asc',
      setEnergyFilter: vi.fn(),
      setSeatFilter: vi.fn(),
      setSortKey: vi.fn(),
      setSortOrder: vi.fn(),
      resetfilters: vi.fn(),
    });

    render(
      <VehicleList onSetVehicleMode={vi.fn()} onSetSelectedVehicle={vi.fn()} />
    );

    // Pas de crash, pas de véhicules affichés
    expect(screen.queryByTestId('vehicle-card')).not.toBeInTheDocument();
    expect(screen.getByText(/aucun véhicule/i)).toBeInTheDocument();
  });
});
