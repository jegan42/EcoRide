// frontend/src/component/dashboard/DashboardFormSwitch.tsx
import type { FormMode } from '../../hooks/useModes';
import { useProfile } from '../../hooks/useProfile';
import { useVehicle } from '../../hooks/useVehicle';
import type { Vehicle } from '../../types/vehicle';
import { ProfileFormSwitch } from '../profile/ProfileFormSwitch';
import { VehicleFormSwitch } from '../vehicle/VehicleFormSwitch';

interface Props {
  profileMode: FormMode;
  onSetProfileMode: (mode: FormMode) => void;
  vehicleMode: FormMode;
  onSetVehicleMode: (mode: FormMode) => void;
  selectedVehicle: Vehicle | null;
}

export const DashboardFormSwitch: React.FC<Props> = ({
  profileMode,
  onSetProfileMode,
  vehicleMode,
  onSetVehicleMode,
  selectedVehicle,
}) => {
  const { isSubmitting: isUserSubmitting } = useProfile();

  const { isSubmitting: isVehicleSubmitting } = useVehicle();

  const isSubmitting = isUserSubmitting || isVehicleSubmitting;

  if (profileMode !== 'view') {
    return (
      <ProfileFormSwitch
        isSubmitting={isSubmitting}
        profileMode={profileMode}
        onSetProfileMode={onSetProfileMode}
      />
    );
  }

  if (vehicleMode !== 'view') {
    return (
      <VehicleFormSwitch
        selectedVehicle={selectedVehicle}
        isSubmitting={isSubmitting}
        vehicleMode={vehicleMode}
        onSetVehicleMode={onSetVehicleMode}
      />
    );
  }

  return null;
};
