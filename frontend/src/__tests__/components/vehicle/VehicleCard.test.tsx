// frontend/src/__tests__/components/vehicle/VehicleCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehicleCard } from '../../../components/vehicle/VehicleCard';
import ecoRideLogo from '../../../assets/ecoride_logo.png';
import { getEnergyLabel } from '../../../types/vehicle';
import { vi } from 'vitest';

describe('VehicleCard', () => {
  const vehicle = {
    id: 'v1',
    brand: 'Toyota',
    model: 'Corolla',
    licensePlate: 'ABC-123',
    vehicleYear: 2020,
    color: 'Red',
    energy: 'electric' as const,
    seatCount: 5,
    photo: 'http://example.com/photo.jpg',
  };

  it('correctly displays vehicle information', () => {
    render(
      <VehicleCard vehicle={vehicle} onEdit={() => {}} onDelete={() => {}} />
    );

    expect(
      screen.getByRole('img', { name: /photo du véhicule/i })
    ).toHaveAttribute('src', vehicle.photo);
    expect(screen.getByText(vehicle.brand)).toBeInTheDocument();
    expect(screen.getByText(vehicle.model)).toBeInTheDocument();
    expect(screen.getByText(vehicle.licensePlate)).toBeInTheDocument();
    expect(
      screen.getByText(`Année ${vehicle.vehicleYear}`)
    ).toBeInTheDocument();
    expect(screen.getByText(vehicle.color)).toBeInTheDocument();
    expect(
      screen.getByText(getEnergyLabel(vehicle.energy))
    ).toBeInTheDocument();
    expect(screen.getByText(`${vehicle.seatCount} places`)).toBeInTheDocument();
  });

  it('use default image if vehicle.photo is absent', () => {
    const vehicleWithoutPhoto = { ...vehicle, photo: undefined };
    render(
      <VehicleCard
        vehicle={vehicleWithoutPhoto}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );

    expect(
      screen.getByRole('img', { name: /photo du véhicule/i })
    ).toHaveAttribute('src', ecoRideLogo);
  });

  it('calls onEdit with the correct id when the Edit button is clicked', async () => {
    const onEdit = vi.fn();
    render(
      <VehicleCard vehicle={vehicle} onEdit={onEdit} onDelete={() => {}} />
    );

    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(vehicle.id);
  });

  it('calls onDelete with the correct id when the Delete button is clicked', async () => {
    const onDelete = vi.fn();
    render(
      <VehicleCard vehicle={vehicle} onEdit={() => {}} onDelete={onDelete} />
    );

    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(vehicle.id);
  });

  it('does not crash if vehicle is undefined', () => {
    render(
      <VehicleCard vehicle={undefined} onEdit={() => {}} onDelete={() => {}} />
    );

    expect(
      screen.getByRole('img', { name: /photo du véhicule/i })
    ).toHaveAttribute('src', ecoRideLogo);
  });
});
