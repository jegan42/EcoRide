// frontend/src/component/dashboard/DashboardListSwitch.tsx
import { Typography } from '@mui/material';
import type { Vehicle } from '../../types/vehicle';
import type { ProfileTabsMode } from '../profile/ProfileTabs';
import { VehicleList } from '../vehicle/VehicleList';
import type { FormMode } from '../../hooks/useModes';

interface Props {
  profileTabs: ProfileTabsMode;
  onSetVehicleMode: (mode: FormMode) => void;
  onSetSelectedVehicle: (vehicle: Vehicle) => void;
}

export const DashboardListSwitch: React.FC<Props> = ({
  profileTabs,
  onSetVehicleMode,
  onSetSelectedVehicle,
}) => {
  if (profileTabs === 'vehicle') {
    return (
      <VehicleList
        onSetVehicleMode={onSetVehicleMode}
        onSetSelectedVehicle={onSetSelectedVehicle}
      />
    );
  }

  return (
    <Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
      {`Vous n'avez encore enregistré aucun ${profileTabs}.`}
    </Typography>
  );
};
