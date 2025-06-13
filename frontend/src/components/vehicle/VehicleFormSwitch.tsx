// frontend/src/component/vehicle/VehicleFormSwitch.tsx
import { DashboardSectionWrapper } from '../dashboard/DashboardSectionWrapper';
import { useVehicle } from '../../hooks/useVehicle';
import type { Vehicle } from '../../types/vehicle';
import type { FormMode } from '../../hooks/useDashboardState';
import { VehicleForm } from './VehicleForm';

interface Props {
  selectedVehicle: Vehicle | null;
  isSubmitting: boolean;
  vehicleMode: FormMode;
  onSetVehicleMode: (mode: FormMode) => void;
}

export const VehicleFormSwitch: React.FC<Props> = ({
  selectedVehicle,
  isSubmitting,
  vehicleMode,
  onSetVehicleMode,
}) => {
  const { onCreateVehicle, onUpdateVehicle } = useVehicle();

  if (vehicleMode === 'add') {
    return (
      <DashboardSectionWrapper title="Ajouter un Véhicule">
        <VehicleForm
          defaultValues={null}
          isSubmitting={isSubmitting}
          onSubmit={async (data) => {
            const success = await onCreateVehicle(data);
            if (success) onSetVehicleMode('view');
          }}
          onCancel={() => onSetVehicleMode('view')}
        />
      </DashboardSectionWrapper>
    );
  }

  if (selectedVehicle && vehicleMode === 'edit') {
    return (
      <DashboardSectionWrapper title="Modifier un Véhicule">
        <VehicleForm
          defaultValues={selectedVehicle}
          isSubmitting={isSubmitting}
          onSubmit={async (data) => {
            const success = await onUpdateVehicle(data);
            if (success) onSetVehicleMode('view');
          }}
          onCancel={() => onSetVehicleMode('view')}
        />
      </DashboardSectionWrapper>
    );
  }

  return null;
};
