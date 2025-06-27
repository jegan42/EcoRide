// frontend/src/component/vehicle/VehicleFormSwitch.tsx
import { DashboardSectionWrapper } from '../dashboard/DashboardSectionWrapper';
import { useVehicle } from '../../hooks/useVehicle';
import type { Vehicle } from '../../types/vehicle';
import type { DashboardMode } from '../../hooks/useDashboardState';
import { VehicleForm } from './VehicleForm';
import { _includes } from 'zod/v4/core';

interface Props {
  isSubmitting: boolean;
  dashboardMode: DashboardMode;
  setDashboardMode: (mode: DashboardMode) => void;
  selectedData: Vehicle | null;
}

export const VehicleFormSwitch: React.FC<Props> = ({
  isSubmitting,
  dashboardMode,
  setDashboardMode,
  selectedData,
}) => {
  const { onCreateVehicle, onUpdateVehicle } = useVehicle();

  if (dashboardMode === 'vehicleAdd') {
    return (
      <DashboardSectionWrapper title="Ajouter un Véhicule">
        <VehicleForm
          defaultValues={null}
          isSubmitting={isSubmitting}
          onSubmit={async (data) => {
            const success = await onCreateVehicle(data);
            if (success) setDashboardMode('vehicleView');
          }}
          onCancel={() => setDashboardMode('vehicleView')}
        />
      </DashboardSectionWrapper>
    );
  }

  if (selectedData && dashboardMode.includes('Edit')) {
    return (
      <DashboardSectionWrapper title="Modifier un Véhicule">
        <VehicleForm
          defaultValues={selectedData}
          isSubmitting={isSubmitting}
          onSubmit={async (data) => {
            const success = await onUpdateVehicle(data);
            if (success) setDashboardMode('vehicleView');
          }}
          onCancel={() => setDashboardMode('vehicleView')}
        />
      </DashboardSectionWrapper>
    );
  }

  return null;
};
