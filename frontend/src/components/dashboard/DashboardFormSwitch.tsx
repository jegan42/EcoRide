// frontend/src/component/dashboard/DashboardFormSwitch.tsx
import type { FormMode } from '../../hooks/useModes';
import { usePreferences } from '../../hooks/usePreferences';
import { useProfile } from '../../hooks/useProfile';
import { useVehicle } from '../../hooks/useVehicle';
import type { Vehicle } from '../../types/vehicle';
import { PreferencesFormSwitch } from '../preferences/PreferencesFormSwitch';
import { ProfileFormSwitch } from '../profile/ProfileFormSwitch';
import { VehicleFormSwitch } from '../vehicle/VehicleFormSwitch';

interface Props {
  profileMode: FormMode;
  onSetProfileMode: (mode: FormMode) => void;
  preferencesMode: FormMode;
  onSetPreferencesMode: (mode: FormMode) => void;
  vehicleMode: FormMode;
  onSetVehicleMode: (mode: FormMode) => void;
  selectedVehicle: Vehicle | null;
}

export const DashboardFormSwitch: React.FC<Props> = ({
  profileMode,
  onSetProfileMode,
  preferencesMode,
  onSetPreferencesMode,
  vehicleMode,
  onSetVehicleMode,
  selectedVehicle,
}) => {
  const { isSubmitting: isUserSubmitting } = useProfile();

  const { isSubmitting: isPreferencesSubmitting } = usePreferences();

  const { isSubmitting: isVehicleSubmitting } = useVehicle();

  const isSubmitting =
    isUserSubmitting || isPreferencesSubmitting || isVehicleSubmitting;

  if (profileMode !== 'view') {
    return (
      <ProfileFormSwitch
        isSubmitting={isSubmitting}
        profileMode={profileMode}
        onSetProfileMode={onSetProfileMode}
      />
    );
  }

  if (preferencesMode !== 'view') {
    return (
      <PreferencesFormSwitch
        isSubmitting={isSubmitting}
        preferencesMode={preferencesMode}
        onSetPreferencesMode={onSetPreferencesMode}
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
