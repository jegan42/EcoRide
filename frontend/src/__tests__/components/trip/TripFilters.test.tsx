// frontend/src/__tests__/components/trip/TripFilters.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TripFilters } from '../../../components/trip/TripFilters';
import { vi } from 'vitest';
import type { VehicleEnergy } from '../../../types/vehicle';

describe('TripFilters', () => {
  const trip1 = {
    id: '123',
    departureCity: 'Paris',
    arrivalCity: 'Lyon',
    departureDate: new Date().toISOString(),
    arrivalDate: new Date().toISOString(),
    price: 25,
    availableSeats: 3,
    status: 'open',
    driverId: '',
    vehicleId: '',
    createdAt: '',
    updatedAt: '',
    vehicle: {
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
    },
  };

  const trip2 = {
    id: '234',
    departureCity: 'Mars',
    arrivalCity: 'Pluton',
    departureDate: new Date().toISOString(),
    arrivalDate: new Date().toISOString(),
    price: 299,
    availableSeats: 2,
    status: 'full',
    driverId: '',
    vehicleId: '',
    createdAt: '',
    updatedAt: '',
    vehicle: {
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
    },
  };
  const setVehicleFilter = vi.fn();
  const setEnergyFilter = vi.fn();
  const setDepartureFilter = vi.fn();
  const resetfilters = vi.fn();
  const setArrivalFilter = vi.fn();
  const setStatusFilter = vi.fn();
  const user = userEvent.setup();

  it('renders vehicle, departure, arrival and status filters and calls callbacks correctly', async () => {
    render(
      <TripFilters
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        trips={[trip1, trip2, undefined as any]}
        vehicleFilter=""
        energyFilter=""
        departureFilter=""
        arrivalFilter=""
        statusFilter=""
        setVehicleFilter={setVehicleFilter}
        setEnergyFilter={setEnergyFilter}
        setDepartureFilter={setDepartureFilter}
        setArrivalFilter={setArrivalFilter}
        setStatusFilter={setStatusFilter}
        resetfilters={resetfilters}
      />
    );
    const comboboxes = screen.getAllByRole('combobox');
    const vehicleSelect = comboboxes[0];
    const energySelect = comboboxes[1];
    const departureSelect = comboboxes[2];
    const arrivalSelect = comboboxes[3];
    const statusSelect = comboboxes[4];

    await user.click(vehicleSelect);
    const vehicleOption = await screen.findByRole('option', {
      name: 'Renault',
    });
    await user.click(vehicleOption);
    expect(setVehicleFilter).toHaveBeenCalledWith('Renault');

    await user.click(energySelect);
    const energyOption = await screen.findByRole('option', { name: 'petrol' });
    await user.click(energyOption);
    expect(setEnergyFilter).toHaveBeenCalledWith('petrol');

    await user.click(departureSelect);
    const departureOption = await screen.findByRole('option', { name: 'Mars' });
    await user.click(departureOption);
    expect(setDepartureFilter).toHaveBeenCalledWith('Mars');

    await user.click(arrivalSelect);
    const arrivelOption = await screen.findByRole('option', { name: 'Lyon' });
    await user.click(arrivelOption);
    expect(setArrivalFilter).toHaveBeenCalledWith('Lyon');

    await user.click(statusSelect);
    const statusOption = await screen.findByRole('option', { name: 'full' });
    await user.click(statusOption);
    expect(setStatusFilter).toHaveBeenCalledWith('full');

    const resetButton = screen.getByRole('button');
    await user.click(resetButton);
    expect(resetfilters).toHaveBeenCalled();
  });
});
