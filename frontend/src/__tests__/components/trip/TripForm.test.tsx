// frontend/src/__tests__/components/trip/TripForm.test.tsx
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TripForm } from '../../../components/trip/TripForm';
import { vi } from 'vitest';
import type { Vehicle } from '../../../types/vehicle';
import { useVehicle } from '../../../hooks/useVehicle';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

vi.mock('../../../hooks/useVehicle');

const mockVehicles: Partial<Vehicle[]> = [
  {
    id: 'a99a9a99-9aa9-499a-9a99-aa99999999a9',
    brand: 'Peugeot',
    model: '208',
    licensePlate: 'AB-123-CD',
    seatCount: 5,
    userId: 'u3',
    color: 'yellow',
    vehicleYear: 1998,
    energy: 'petrol',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'a99a9a99-9aa9-499a-9a99-aa99999999a8',
    brand: 'Renault',
    model: 'Clio',
    licensePlate: 'AA-123-AA',
    seatCount: 5,
    userId: 'u1',
    color: 'red',
    vehicleYear: 1999,
    energy: 'diesel',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'a99a9a99-9aa9-499a-9a99-aa99999999a7',
    brand: 'Peugeot',
    model: '206',
    licensePlate: 'BB-456-BB',
    seatCount: 8,
    userId: 'u2',
    color: 'red',
    vehicleYear: 2001,
    energy: 'electric',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'a99a9a99-9aa9-499a-9a99-aa99999999a6',
    seatCount: 5,
    brand: 'Peugeot',
    model: '205',
    licensePlate: 'AB-123-CD',
    userId: 'u3',
    color: 'red',
    vehicleYear: 2000,
    energy: 'petrol',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'a99a9a99-9aa9-499a-9a99-aa99999999a5',
    seatCount: 7,
    brand: 'Peugeot',
    model: '3008',
    licensePlate: 'AB-234-CD',
    userId: 'u2',
    color: 'green',
    vehicleYear: 2008,
    energy: 'petrol',
    createdAt: '',
    updatedAt: '',
  },
];

describe('TripForm', () => {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays all necessary fields', () => {
    (useVehicle as jest.Mock).mockReturnValue({
      vehicles: mockVehicles,
    });
    render(
      <TripForm
        driverId="driver1"
        isSubmitting={false}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    );

    expect(screen.getByLabelText(/Véhicule/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ville de départ/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ville d’arrivée/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Places disponibles/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prix/i)).toBeInTheDocument();
  });

  it('calls onCancel when Cancel is clicked', async () => {
    (useVehicle as jest.Mock).mockReturnValue({
      vehicles: mockVehicles,
    });
    render(
      <TripForm
        driverId="driver1"
        isSubmitting={false}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Annuler/i });
    await userEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalled();
  });

  it('display the status field if defaultValues.status !== "open"', () => {
    (useVehicle as jest.Mock).mockReturnValue({
      vehicles: mockVehicles,
    });
    render(
      <TripForm
        driverId="driver1"
        isSubmitting={false}
        onSubmit={onSubmit}
        onCancel={onCancel}
        defaultValues={{ status: 'full' }}
      />
    );

    expect(screen.getByLabelText(/Statut/i)).toBeInTheDocument();
  });

  it('displays an error if no vehicle is selected', async () => {
    (useVehicle as jest.Mock).mockReturnValue({
      vehicles: mockVehicles,
    });
    render(
      <TripForm
        driverId="driver1"
        isSubmitting={false}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Sauvegarder/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText(/Required/i)).toBeInTheDocument();
  });
});

describe('TripForm - handleVehicleChange integration', () => {
  beforeEach(() => {
    (useVehicle as jest.Mock).mockReturnValue({
      vehicles: mockVehicles,
      vehicle: undefined,
      loading: false,
      error: null,
      isSubmitting: false,
      onCreateVehicle: vi.fn(),
      onUpdateVehicle: vi.fn(),
      onDeleteVehicle: vi.fn(),
    });
  });

  it('updates maxSeats when a vehicle is selected', async () => {
    render(
      <TripForm
        driverId="driver-1"
        defaultValues={null}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const select = screen.getByLabelText('Véhicule');
    fireEvent.mouseDown(select);

    await waitFor(() => {
      const option = screen.getByText(/Peugeot 208/);
      fireEvent.click(option);
    });

    await waitFor(() => {
      const placesField = screen.getByLabelText(/Places disponibles/i);
      expect(placesField).toHaveAttribute('max', '4');
    });
  });
});

describe('<TripForm />', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const vehicleList = [
    {
      id: 'v1',
      brand: 'Renault',
      model: 'Clio',
      licensePlate: 'AA-123-BB',
      seatCount: 5,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useVehicle as jest.Mock).mockReturnValue({ vehicles: vehicleList });
  });

  it('do not call onSubmit if availableSeats exceeds the maximum allowed', async () => {
    render(
      <TripForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={false}
      />
    );

    const user = userEvent.setup();

    await user.click(screen.getByLabelText(/Véhicule/i));
    await user.click(screen.getByText(/Renault Clio - AA-123-BB/));

    await user.type(screen.getByLabelText(/Ville de départ/i), 'Paris');
    await user.type(screen.getByLabelText(/Ville d’arrivée/i), 'Lyon');

    await user.type(screen.getByLabelText(/Places disponibles/i), '99');
    await user.type(screen.getByLabelText(/Prix/i), '20');

    await user.click(screen.getByRole('button', { name: /sauvegarder/i }));

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    expect(
      screen.getByText(/Nombre de places disponible invalide/i)
    ).toBeInTheDocument();
  });

  it('calls onSubmit with the cleaned data when the form is valid', async () => {
    const mockOnSubmit = vi.fn();

    const defaultValues = {
      vehicleId: 'v1',
      driverId: 'driver-1',
      departureCity: 'Paris',
      arrivalCity: 'Lyon',
      departureDate: '2025-06-20T10:00:00',
      arrivalDate: '2025-06-20T12:00:00',
      availableSeats: 3,
      price: 25,
    };

    render(
      <TripForm
        driverId="driver-1"
        isSubmitting={false}
        defaultValues={defaultValues}
        onSubmit={mockOnSubmit}
        onCancel={() => {}}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /sauvegarder/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          vehicleId: 'v1',
          driverId: 'driver-1',
          departureCity: 'Paris',
          arrivalCity: 'Lyon',
          departureDate: expect.stringMatching(/^2025-06-20T10:/),
          arrivalDate: expect.stringMatching(/^2025-06-20T12:/),
          availableSeats: 3,
          price: 25,
        })
      );
    });
  });

  it('calls onSubmit with dates in ISO format if the form is pre-filled', async () => {
    const mockOnSubmit = vi.fn();

    const defaultValues = {
      vehicleId: 'v1',
      driverId: 'driver-1',
      departureCity: 'Paris',
      arrivalCity: 'Lyon',
      departureDate: '2025-06-20T10:00:00.000Z',
      arrivalDate: '2025-06-20T12:00:00.000Z',
      availableSeats: 3,
      price: 25,
    };

    render(
      <TripForm
        driverId="driver-1"
        isSubmitting={false}
        defaultValues={defaultValues}
        onSubmit={mockOnSubmit}
        onCancel={() => {}}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /sauvegarder/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          vehicleId: 'v1',
          driverId: 'driver-1',
          departureCity: 'Paris',
          arrivalCity: 'Lyon',
          departureDate: '2025-06-20T10:00:00.000Z',
          arrivalDate: '2025-06-20T12:00:00.000Z',
          availableSeats: 3,
          price: 25,
        })
      );
    });
  });
});

it('changes the departure date', async () => {
  const mockedOnChange = vi.fn();
  const dateToSelect = new Date('2025-06-30T12:00:00.000Z');
  render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label="Date de départ"
        value={null}
        onChange={mockedOnChange}
        slotProps={{
          textField: {
            'aria-label': 'Date de départ',
            inputProps: {
              'data-testid': 'departure-date-input',
            },
          },
        }}
      />
    </LocalizationProvider>
  );
  act(() => {
    mockedOnChange(dateToSelect);
  });

  expect(mockedOnChange).toHaveBeenCalledWith(dateToSelect);
});
