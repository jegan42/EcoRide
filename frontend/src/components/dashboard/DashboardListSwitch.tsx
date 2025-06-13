// frontend/src/component/dashboard/DashboardListSwitch.tsx
import { Typography } from '@mui/material';
import type { Vehicle } from '../../types/vehicle';
import type { ProfileTabsMode } from '../profile/ProfileTabs';
import { VehicleList } from '../vehicle/VehicleList';
import type { FormMode } from '../../hooks/useDashboardState';
import { PreferencesView } from '../preferences/PreferencesView';
import type { Trip } from '../../types/trip';
import { TripList } from '../trip/TripList';

interface Props {
  profileTabs: ProfileTabsMode;
  onSetPreferencesMode: (mode: FormMode) => void;
  onSetVehicleMode: (mode: FormMode) => void;
  onSetSelectedVehicle: (vehicle: Vehicle) => void;
  onSetTripMode: (mode: FormMode) => void;
  onSetSelectedTrip: (trip: Trip) => void;
}

export const DashboardListSwitch: React.FC<Props> = ({
  profileTabs,
  onSetPreferencesMode,
  onSetVehicleMode,
  onSetSelectedVehicle,
  onSetTripMode,
  onSetSelectedTrip,
}) => {
  if (profileTabs === 'preference') {
    return <PreferencesView onSetPreferencesMode={onSetPreferencesMode} />;
  }
  if (profileTabs === 'vehicle') {
    return (
      <VehicleList
        onSetVehicleMode={onSetVehicleMode}
        onSetSelectedVehicle={onSetSelectedVehicle}
      />
    );
  }
  if (profileTabs === 'trip') {
    return (
      <TripList
        onSetTripMode={onSetTripMode}
        onSetSelectedTrip={onSetSelectedTrip}
      />
    );
  }

  return (
    <Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
      {`Vous n'avez encore enregistré aucun ${profileTabs}.`}
    </Typography>
  );
};
