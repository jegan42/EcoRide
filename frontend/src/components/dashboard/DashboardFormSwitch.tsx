// frontend/src/component/dashboard/DashboardFormSwitch.tsx
import type { DashboardMode } from '../../hooks/useDashboardState';
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
  dashboardMode: DashboardMode;
  setDashboardMode: (mode: DashboardMode) => void;
  selectedData: Vehicle | Trip | null;
}

export const DashboardFormSwitch: React.FC<Props> = ({
  dashboardMode,
  setDashboardMode,
  selectedData,
}) => {
  const { isSubmitting: isUserSubmitting } = useProfile();

  const { isSubmitting: isPreferencesSubmitting } = usePreferences();

  const { isSubmitting: isVehicleSubmitting } = useVehicle();

  const { isSubmitting: isTripSubmitting } = useTrip();

  if (dashboardMode.includes('profil')) {
    return (
      <ProfileFormSwitch
        isSubmitting={isUserSubmitting}
        dashboardMode={dashboardMode}
        setDashboardMode={setDashboardMode}
      />
    );
  }

  if (dashboardMode.includes('preferences')) {
    return (
      <PreferencesFormSwitch
        isSubmitting={isPreferencesSubmitting}
        dashboardMode={dashboardMode}
        setDashboardMode={setDashboardMode}
      />
    );
  }

  if (dashboardMode.includes('vehicle')) {
    return (
      <VehicleFormSwitch
        isSubmitting={isVehicleSubmitting}
        dashboardMode={dashboardMode}
        setDashboardMode={setDashboardMode}
        selectedData={selectedData as Vehicle}
      />
    );
  }

  if (dashboardMode.includes('trip')) {
    return (
      <TripFormSwitch
        isSubmitting={isTripSubmitting}
        dashboardMode={dashboardMode}
        setDashboardMode={setDashboardMode}
        selectedData={selectedData as Trip}
      />
    );
  }
  return null;
};
