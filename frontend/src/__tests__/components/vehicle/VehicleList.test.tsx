// frontend/src/__tests__/components/vehicle/VehicleList.test.tsx
import { render, screen, fireEvent, within } from '@testing-library/react';
import { VehicleList } from '../../../components/vehicle/VehicleList';
import { vi } from 'vitest';
import { useVehicle } from '../../../../src/hooks/useVehicle';

vi.mock('../../../hooks/useVehicle', () => ({
  useVehicle: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.resetModules();
});

describe('VehicleList', () => {
  const mockOnSetVehicleMode = vi.fn();
  const mockOnSetSelectedVehicle = vi.fn();

  it('displays vehicles when the list is not empty', () => {
    (useVehicle as jest.Mock).mockReturnValue({
      vehicles: [{ id: '1', brand: 'Toyota', model: 'Corolla', year: 2020 }],
      onDeleteVehicle: vi.fn(),
    });

    render(
      <VehicleList
        onSetVehicleMode={mockOnSetVehicleMode}
        onSetSelectedVehicle={mockOnSetSelectedVehicle}
      />
    );

    expect(screen.getByText(/Toyota/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Vous n’avez encore enregistré aucun véhicule/i)
    ).not.toBeInTheDocument();
  });

  it('display the message when the list is empty', () => {
    (useVehicle as jest.Mock).mockReturnValue({
      vehicles: [],
      onDeleteVehicle: vi.fn(),
    });

    render(
      <VehicleList
        onSetVehicleMode={mockOnSetVehicleMode}
        onSetSelectedVehicle={mockOnSetSelectedVehicle}
      />
    );

    expect(
      screen.getByRole('button', { name: /Ajouter un véhicule/i })
    ).toBeInTheDocument();
  });

  it('calls onEdit and onSetSelectedVehicle when edit is clicked', () => {
    const vehicle = { id: '1', brand: 'Toyota', model: 'Corolla', year: 2020 };
    (useVehicle as jest.Mock).mockReturnValue({
      vehicles: [vehicle],
      onDeleteVehicle: vi.fn(),
    });

    render(
      <VehicleList
        onSetVehicleMode={mockOnSetVehicleMode}
        onSetSelectedVehicle={mockOnSetSelectedVehicle}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockOnSetVehicleMode).toHaveBeenCalledWith('edit');
    expect(mockOnSetSelectedVehicle).toHaveBeenCalledWith(vehicle);
  });

  it('calls onSetVehicleMode with "add" when Add button is clicked', () => {
    render(
      <VehicleList
        onSetVehicleMode={mockOnSetVehicleMode}
        onSetSelectedVehicle={mockOnSetSelectedVehicle}
      />
    );

    const addButton = screen.getByRole('button', {
      name: /ajouter un véhicule/i,
    });
    fireEvent.click(addButton);

    expect(mockOnSetVehicleMode).toHaveBeenCalledWith('add');
  });

  it('calls onDeleteVehicle when delete icon is clicked and confirmed', () => {
    const onDeleteVehicle = vi.fn();

    (useVehicle as jest.Mock).mockReturnValue({
      vehicles: [
        {
          id: '1',
          brand: 'Tesla',
          model: 'Model 3',
          energy: 'electric',
          seatCount: 5,
          licensePlate: 'ABC123',
          vehicleYear: 2020,
          color: 'red',
        },
      ],
      error: null,
      onDeleteVehicle,
    });

    render(
      <VehicleList
        onSetVehicleMode={mockOnSetVehicleMode}
        onSetSelectedVehicle={mockOnSetSelectedVehicle}
      />
    );

    const deleteButton = screen.getByLabelText(/delete|supprimer/i);
    fireEvent.click(deleteButton);

    const dialog = screen.getByRole('dialog', { name: /confirmation/i });

    const confirmButton = within(dialog).getByLabelText(/confirm|confirmer/i);

    fireEvent.click(confirmButton);

    expect(onDeleteVehicle).toHaveBeenCalledWith({ id: '1' });
  });

  it('filters undefined vehicles in vehiclesToSet', () => {
    (useVehicle as jest.Mock).mockReturnValue({
      error: null,
      vehicles: [
        {
          id: '1',
          brand: 'tesla',
          model: 'Model X',
          energy: 'electric',
          seatCount: 3,
          licensePlate: 'AAA-tesla-000',
          vehicleYear: 2024,
          color: 'rouge',
        },
        undefined,
        {
          id: '2',
          brand: 'tesla',
          model: 'Model Y',
          energy: 'electric',
          seatCount: 3,
          licensePlate: 'BBB-tesla-000',
          vehicleYear: 2024,
          color: 'rouge',
        },
      ],
      onDeleteVehicle: vi.fn(),
    });

    render(
      <VehicleList onSetVehicleMode={vi.fn()} onSetSelectedVehicle={vi.fn()} />
    );

    expect(screen.getByText(/Model X/i)).toBeInTheDocument();
    expect(screen.getByText(/Model Y/i)).toBeInTheDocument();

    expect(screen.queryByText(/undefined/i)).not.toBeInTheDocument();
  });

  it('handles the case where vehicles is undefined', () => {
    (useVehicle as jest.Mock).mockReturnValue({
      error: null,
      vehicles: undefined,
      onDeleteVehicle: vi.fn(),
    });

    render(
      <VehicleList onSetVehicleMode={vi.fn()} onSetSelectedVehicle={vi.fn()} />
    );

    expect(screen.queryByText(/Model/i)).not.toBeInTheDocument();

    expect(screen.getByText(/aucun véhicule/i)).toBeInTheDocument();
  });

  it('handles the case where vehicles is null', () => {
    (useVehicle as jest.Mock).mockReturnValue({
      error: null,
      vehicles: null,
      onDeleteVehicle: vi.fn(),
    });

    render(
      <VehicleList onSetVehicleMode={vi.fn()} onSetSelectedVehicle={vi.fn()} />
    );

    expect(screen.queryByText(/Model/i)).not.toBeInTheDocument();
    expect(screen.getByText(/aucun véhicule/i)).toBeInTheDocument();
  });

  it('handles the case where error is defined', () => {
    (useVehicle as jest.Mock).mockReturnValue({
      error: 'something wrong',
      vehicles: undefined,
      onDeleteVehicle: vi.fn(),
    });

    render(
      <VehicleList onSetVehicleMode={vi.fn()} onSetSelectedVehicle={vi.fn()} />
    );

    expect(screen.getByText(/something wrong/i)).toBeInTheDocument();
  });
});
