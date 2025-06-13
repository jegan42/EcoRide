// frontend/src/__tests__/components/trip/TripCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi, expect } from 'vitest';
import { TripCard } from '../../../components/trip/TripCard';
import type { Trip } from '../../../types/trip';

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

const mockTrip: Trip = {
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
};

describe('<TripCard />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders trip info correctly', () => {
    render(<TripCard trip={mockTrip} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText(/Paris → Lyon/i)).toBeInTheDocument();
    expect(screen.getByText(/Prix : 25 €/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    render(<TripCard trip={mockTrip} onEdit={onEdit} onDelete={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith('123');
  });

  it('calls handleDeleteClick when cancel button is clicked', async () => {
    render(<TripCard trip={mockTrip} onEdit={vi.fn()} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(handleDeleteClick).toHaveBeenCalledWith('123');
  });

  it('calls setDialogOpen(false) when cancel button is clicked', async () => {
    dialogOpen = true;
    render(<TripCard trip={mockTrip} onEdit={vi.fn()} onDelete={vi.fn()} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(setDialogOpen).toHaveBeenCalledWith(false);
  });

  it('calls handleConfirmDelete(onDelete) when confirm button is clicked', async () => {
    dialogOpen = true;
    const onDelete = vi.fn();

    render(<TripCard trip={mockTrip} onEdit={vi.fn()} onDelete={onDelete} />);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await userEvent.click(confirmButton);

    expect(handleConfirmDelete).toHaveBeenCalledWith(onDelete);
  });
});
