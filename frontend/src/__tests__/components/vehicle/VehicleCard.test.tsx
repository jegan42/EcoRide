// frontend/src/__tests__/components/vehicle/VehicleCard.test.tsx
import { render, screen, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehicleCard } from '../../../components/vehicle/VehicleCard';
import ecoRideLogo from '../../../assets/ecoride_logo.png';
import { getEnergyLabel } from '../../../types/vehicle';
import { vi } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const handleDeleteClick = vi.fn();
const setDialogOpen = vi.fn();
const handleConfirmDelete = vi.fn();
let dialogOpen = false;

vi.mock('../../../hooks/useDialog', () => ({
  useDialog: () => ({
    dialogOpen,
    setDialogOpen,
    handleDeleteClick,
    handleConfirmDelete,
  }),
}));

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

describe('VehicleCard', () => {
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

  it('does not crash if vehicle is undefined', () => {
    render(
      <VehicleCard vehicle={undefined} onEdit={() => {}} onDelete={() => {}} />
    );

    expect(
      screen.getByRole('img', { name: /photo du véhicule/i })
    ).toHaveAttribute('src', ecoRideLogo);
  });

  it('calls handleDeleteClick when delete button is clicked', async () => {
    render(
      <VehicleCard vehicle={vehicle} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(handleDeleteClick).toHaveBeenCalledWith('v1');
  });

  it('calls setDialogOpen(false) when cancel button is clicked', async () => {
    dialogOpen = true;
    render(
      <VehicleCard vehicle={vehicle} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    const deleteButton = screen.getByRole('button', { name: /cancel/i });
    await userEvent.click(deleteButton);

    expect(setDialogOpen).toHaveBeenCalledWith(false);
  });

  it('calls handleConfirmDelete(onDelete) when confirm button is clicked', async () => {
    dialogOpen = true;
    const onDelete = vi.fn();

    render(
      <VehicleCard vehicle={vehicle} onEdit={vi.fn()} onDelete={onDelete} />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await userEvent.click(confirmButton);

    expect(handleConfirmDelete).toHaveBeenCalledWith(onDelete);
  });
});

const renderWithTheme = (ui: React.ReactElement): RenderResult =>
  render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>);

describe('VehicleCard styling', () => {
  it('applies onlyCard styles when no edit/delete handlers are passed', () => {
    renderWithTheme(<VehicleCard vehicle={vehicle} />);

    const paper = screen.getByLabelText('vehicle-card');

    expect(paper).toHaveStyle({ marginTop: 'unset' });

    const imageContainer = paper.querySelector('img')?.parentElement;
    expect(imageContainer).toHaveStyle({ width: '30%' });
  });

  it('applies edit/delete styles when handlers are passed', () => {
    renderWithTheme(
      <VehicleCard vehicle={vehicle} onEdit={() => {}} onDelete={() => {}} />
    );

    const paper = screen.getByLabelText('vehicle-card');
    expect(paper).toHaveStyle({ marginTop: 4 });

    const imageContainer = paper.querySelector('img')?.parentElement;
    expect(imageContainer).toHaveStyle({ width: '22%' });
  });
});
