// frontend/src/__tests__/components/dashboard/DashboardFormSwitch.test.tsx
import { render, screen } from '@testing-library/react';
import { DashboardFormSwitch } from '../../../components/dashboard/DashboardFormSwitch';
import type { Vehicle } from '../../../types/vehicle';
import * as useProfileModule from '../../../hooks/useProfile';
import * as useVehicleModule from '../../../hooks/useVehicle';
import { vi } from 'vitest';
import type { User } from '../../../types/user';
import type { ProfileFormData } from '../../../validations/profileSchema';
import type { VehicleFormOutput } from '../../../validations/vehicleSchema';

vi.mock('../../../components/profile/ProfileFormSwitch', () => ({
  ProfileFormSwitch: ({ isSubmitting }: { isSubmitting: boolean }) => (
    <div data-testid="profile-form">ProfileForm - {String(isSubmitting)}</div>
  ),
}));

vi.mock('../../../components/vehicle/VehicleFormSwitch', () => ({
  VehicleFormSwitch: ({ isSubmitting }: { isSubmitting: boolean }) => (
    <div data-testid="vehicle-form">VehicleForm - {String(isSubmitting)}</div>
  ),
}));

describe('DashboardFormSwitch', () => {
  const mockVehicle: Vehicle = {
    id: 'v1',
    brand: 'Toyota',
    model: 'Yaris',
    userId: 'u1',
    licensePlate: '123',
    energy: 'electric',
    seatCount: 4,
    vehicleYear: 2020,
    color: 'blue',
    createdAt: '',
    updatedAt: '',
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  const mockHooks = (
    isUserSubmitting: boolean,
    isVehicleSubmitting: boolean
  ): void => {
    vi.spyOn(useProfileModule, 'useProfile').mockReturnValue({
      user: null,
      isDriver: false,
      onUpdateUser: vi.fn(),
      isSubmitting: isUserSubmitting,
    } as {
      user: Partial<User> | null;
      isDriver: boolean;
      isSubmitting: boolean;
      onUpdateUser: (formData: ProfileFormData) => Promise<boolean>;
    });

    vi.spyOn(useVehicleModule, 'useVehicle').mockReturnValue({
      vehicles: [],
      vehicle: undefined,
      loading: false,
      error: null,
      onCreateVehicle: vi.fn(),
      onUpdateVehicle: vi.fn(),
      onDeleteVehicle: vi.fn(),
      isSubmitting: isVehicleSubmitting,
    } as {
      vehicles: Partial<Vehicle[]>;
      vehicle: Partial<Vehicle> | undefined;
      loading: boolean;
      error: string | null;
      isSubmitting: boolean;
      onCreateVehicle: (data: VehicleFormOutput) => Promise<boolean>;
      onUpdateVehicle: (formData: VehicleFormOutput) => Promise<boolean>;
      onDeleteVehicle: (formData: VehicleFormOutput) => Promise<boolean>;
    });
  };

  it('renders ProfileFormSwitch when profileMode is not "view"', () => {
    mockHooks(true, false);

    render(
      <DashboardFormSwitch
        profileMode="edit"
        vehicleMode="view"
        onSetProfileMode={() => {}}
        onSetVehicleMode={() => {}}
        selectedVehicle={mockVehicle}
      />
    );

    expect(screen.getByTestId('profile-form')).toBeInTheDocument();
    expect(screen.queryByTestId('vehicle-form')).not.toBeInTheDocument();
  });

  it('renders VehicleFormSwitch when profileMode is "view" and vehicleMode is not "view"', () => {
    mockHooks(false, true);

    render(
      <DashboardFormSwitch
        profileMode="view"
        vehicleMode="edit"
        onSetProfileMode={() => {}}
        onSetVehicleMode={() => {}}
        selectedVehicle={mockVehicle}
      />
    );

    expect(screen.getByTestId('vehicle-form')).toBeInTheDocument();
    expect(screen.queryByTestId('profile-form')).not.toBeInTheDocument();
  });

  it('renders nothing when both modes are "view"', () => {
    mockHooks(false, false);

    const { container } = render(
      <DashboardFormSwitch
        profileMode="view"
        vehicleMode="view"
        onSetProfileMode={() => {}}
        onSetVehicleMode={() => {}}
        selectedVehicle={mockVehicle}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
