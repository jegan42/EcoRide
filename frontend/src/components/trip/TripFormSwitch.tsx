// frontend/src/component/trip/TripFormSwitch.tsx
import { DashboardSectionWrapper } from '../dashboard/DashboardSectionWrapper';
import { useTrip } from '../../hooks/useTrip';
import type { Trip } from '../../types/trip';
import type { DashboardMode } from '../../hooks/useDashboardState';
import { TripForm } from './TripForm';
import { useProfile } from '../../hooks/useProfile';

interface Props {
  isSubmitting: boolean;
  dashboardMode: DashboardMode;
  setDashboardMode: (mode: DashboardMode) => void;
  selectedData: Trip | null;
}

export const TripFormSwitch: React.FC<Props> = ({
  isSubmitting,
  dashboardMode,
  setDashboardMode,
  selectedData,
}) => {
  const { user } = useProfile();
  const { onCreateTrip, onUpdateTrip } = useTrip();

  if (user && dashboardMode === 'tripAdd') {
    return (
      <DashboardSectionWrapper title="Ajouter un Voyage">
        <TripForm
          driverId={user.id}
          defaultValues={null}
          isSubmitting={isSubmitting}
          onSubmit={async (data) => {
            const success = await onCreateTrip(data);
            if (success) setDashboardMode('tripView');
          }}
          onCancel={() => setDashboardMode('tripView')}
        />
      </DashboardSectionWrapper>
    );
  }

  if (user && selectedData && dashboardMode === 'tripEdit') {
    return (
      <DashboardSectionWrapper title="Modifier un Voyage">
        <TripForm
          driverId={user.id}
          defaultValues={selectedData}
          isSubmitting={isSubmitting}
          onSubmit={async (data) => {
            const success = await onUpdateTrip(selectedData.id, data);
            if (success) setDashboardMode('tripView');
          }}
          onCancel={() => setDashboardMode('tripView')}
        />
      </DashboardSectionWrapper>
    );
  }

  return null;
};
