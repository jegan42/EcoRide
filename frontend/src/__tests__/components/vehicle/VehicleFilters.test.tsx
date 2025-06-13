// frontend/src/__tests__/components/vehicle/VehicleFilters.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehicleFilters } from '../../../components/vehicle/VehicleFilters';
import { vi } from 'vitest';
import type { VehicleEnergy } from '../../../types/vehicle';

describe('VehicleFilters', () => {
  const vehicle1 = {
    id: '1',
    brand: 'Renault',
    model: 'Clio',
    energy: 'petrol' as VehicleEnergy,
    seatCount: 5,
    licensePlate: 'ABC-123',
    vehicleYear: 2020,
    color: 'bleu',
    userId: 'u1',
    createdAt: '',
    updatedAt: '',
  };

  const vehicle2 = {
    id: '2',
    brand: 'Peugeot',
    model: '208',
    energy: 'diesel' as VehicleEnergy,
    seatCount: 4,
    licensePlate: 'XYZ-456',
    vehicleYear: 2021,
    color: 'rouge',
    userId: 'u2',
    createdAt: '',
    updatedAt: '',
  };
  const setEnergyFilter = vi.fn();
  const setSeatFilter = vi.fn();
  const resetfilters = vi.fn();
  const user = userEvent.setup();

  it('renders energy and seatCount filters and calls callbacks correctly', async () => {
    render(
      <VehicleFilters
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filteredVehicles={[vehicle1, vehicle2, undefined as any]}
        energyFilter=""
        seatFilter=""
        setEnergyFilter={setEnergyFilter}
        setSeatFilter={setSeatFilter}
        resetfilters={resetfilters}
      />
    );
    const comboboxes = screen.getAllByRole('combobox');
    const energySelect = comboboxes[0];
    const seatSelect = comboboxes[1];

    await user.click(energySelect);
    const dieselOption = await screen.findByRole('option', { name: 'diesel' });
    await user.click(dieselOption);
    expect(setEnergyFilter).toHaveBeenCalledWith('diesel');

    await user.click(seatSelect);
    const seatOption = await screen.findByRole('option', { name: '4' });
    await user.click(seatOption);
    expect(setSeatFilter).toHaveBeenCalledWith(4);

    const resetButton = screen.getByRole('button');
    await user.click(resetButton);
    expect(resetfilters).toHaveBeenCalled();
  });
});
