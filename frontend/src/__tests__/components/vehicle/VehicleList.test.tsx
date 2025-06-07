// frontend/src/__tests__/components/vehicle/VehicleList.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
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
      screen.getByText(/Vous n’avez encore enregistré aucun véhicule/i)
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

  it('calls onDeleteVehicle with the vehicle ID', async () => {
    const mockOnDeleteVehicle = vi.fn();
    const vehicle = {
      id: 'veh123',
      brand: 'Renault',
      model: 'Clio',
      year: 2021,
    };

    (useVehicle as jest.Mock).mockReturnValue({
      vehicles: [vehicle],
      onDeleteVehicle: mockOnDeleteVehicle,
    });

    const { VehicleList } = await import(
      '../../../components/vehicle/VehicleList'
    );
    const { render } = await import('@testing-library/react');

    render(
      <VehicleList onSetVehicleMode={vi.fn()} onSetSelectedVehicle={vi.fn()} />
    );

    const deleteButton = screen.getByRole('button', {
      name: /supprimer|delete/i,
    });

    fireEvent.click(deleteButton);

    expect(mockOnDeleteVehicle).toHaveBeenCalledWith({ id: vehicle.id });
  });
});
