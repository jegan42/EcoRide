// frontend/src/__tests__/components/trip/TripInfo.test.tsx
import { render, screen } from '@testing-library/react';
import { TripInfo } from '../../../components/trip/TripInfo';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

vi.mock('../../../components/vehicle/VehicleCard', () => ({
  VehicleCard: () => <div data-testid="vehicle-card" />,
}));

vi.mock('../../../components/trip/TripCard', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TripCard: ({ onEdit, onDelete }: any) => (
    <div data-testid="trip-card">
      <button onClick={() => onEdit('123')}>Edit</button>
      <button onClick={() => onDelete('123')}>Delete</button>
    </div>
  ),
}));

vi.mock('../../../hooks/useIsMobile', () => ({
  useIsMobile: vi.fn(() => false),
}));

describe('TripInfo', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  const tripMock = {
    vehicle: {
      brand: 'Peugeot',
      model: '208',
    },
    departureCity: 'Paris',
    arrivalCity: 'Lyon',
  };

  it('renders VehicleCard and TripCard with trip data', () => {
    render(
      <TripInfo trip={tripMock} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByTestId('vehicle-card')).toBeInTheDocument();
    expect(screen.getByTestId('trip-card')).toBeInTheDocument();
  });

  it('calls onEdit and onDelete correctly', async () => {
    const user = userEvent.setup();
    render(
      <TripInfo trip={tripMock} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    await user.click(screen.getByText('Edit'));
    await user.click(screen.getByText('Delete'));

    expect(mockOnEdit).toHaveBeenCalledWith('123');
    expect(mockOnDelete).toHaveBeenCalledWith('123');
  });

  it('uses column direction when isMobile is true', () => {
    (useIsMobile as jest.Mock).mockReturnValue(true);

    const { asFragment } = render(
      <TripInfo trip={tripMock} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
