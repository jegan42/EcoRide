// frontend/src/component/vehicle/VehicleList.tsx
import { Typography } from '@mui/material';
import { type Vehicle } from '../../types/vehicle';
import { useVehicle } from '../../hooks/useVehicle';
import type { FormMode } from '../../hooks/useModes';
import { VehicleCard } from './VehicleCard';

interface Props {
  onSetVehicleMode: (mode: FormMode) => void;
  onSetSelectedVehicle: (vehicle: Vehicle) => void;
}

export const VehicleList: React.FC<Props> = ({
  onSetVehicleMode,
  onSetSelectedVehicle,
}) => {
  const { vehicles, onDeleteVehicle } = useVehicle();

  return (
    <>
      {vehicles.length > 0 ? (
        vehicles.map((vehicle) => {
          if (!vehicle) return;
          return (
            <VehicleCard
              key={vehicle?.id}
              vehicle={vehicle}
              onEdit={() => {
                onSetVehicleMode('edit');
                onSetSelectedVehicle(vehicle);
              }}
              onDelete={(id) => onDeleteVehicle({ id })}
            />
          );
        })
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
          Vous n’avez encore enregistré aucun véhicule.
        </Typography>
      )}
    </>
  );
};
