// frontend/src/component/dashboard/DashboardFormSwitch.tsx
import type { FormMode } from '../../hooks/useDashboardState';
import { usePreferences } from '../../hooks/usePreferences';
import { useProfile } from '../../hooks/useProfile';
import { useTrip } from '../../hooks/useTrip';
import { useVehicle } from '../../hooks/useVehicle';
import type { Trip } from '../../types/trip';
import type { Vehicle } from '../../types/vehicle';
import { PreferencesFormSwitch } from '../preferences/PreferencesFormSwitch';
import { ProfileFormSwitch } from '../profile/ProfileFormSwitch';
import { TripFormSwitch } from '../trip/TripFormSwitch';
import { VehicleFormSwitch } from '../vehicle/VehicleFormSwitch';

interface Props {
  profileMode: FormMode;
  onSetProfileMode: (mode: FormMode) => void;
  preferencesMode: FormMode;
  onSetPreferencesMode: (mode: FormMode) => void;
  vehicleMode: FormMode;
  onSetVehicleMode: (mode: FormMode) => void;
  selectedVehicle: Vehicle | null;
  onSetTripMode: (mode: FormMode) => void;
  tripMode: FormMode;
  selectedTrip: Trip | null;
}

export const DashboardFormSwitch: React.FC<Props> = ({
  profileMode,
  onSetProfileMode,
  preferencesMode,
  onSetPreferencesMode,
  vehicleMode,
  onSetVehicleMode,
  selectedVehicle,
  onSetTripMode,
  tripMode,
  selectedTrip,
}) => {
  const { isSubmitting: isUserSubmitting } = useProfile();

  const { isSubmitting: isPreferencesSubmitting } = usePreferences();

  const { isSubmitting: isVehicleSubmitting } = useVehicle();

  const { isSubmitting: isTripSubmitting } = useTrip();

  if (profileMode !== 'view') {
    return (
      <ProfileFormSwitch
        isSubmitting={isUserSubmitting}
        profileMode={profileMode}
        onSetProfileMode={onSetProfileMode}
      />
    );
  }

  if (preferencesMode !== 'view') {
    return (
      <PreferencesFormSwitch
        isSubmitting={isPreferencesSubmitting}
        preferencesMode={preferencesMode}
        onSetPreferencesMode={onSetPreferencesMode}
      />
    );
  }

  if (vehicleMode !== 'view') {
    return (
      <VehicleFormSwitch
        selectedVehicle={selectedVehicle}
        isSubmitting={isVehicleSubmitting}
        vehicleMode={vehicleMode}
        onSetVehicleMode={onSetVehicleMode}
      />
    );
  }

  if (tripMode !== 'view') {
    return (
      <TripFormSwitch
        selectedTrip={selectedTrip}
        isSubmitting={isTripSubmitting}
        tripMode={tripMode}
        onSetTripMode={onSetTripMode}
      />
    );
  }
  return null;
};
