// frontend/src/component/trip/TripFormSwitch.tsx
import { DashboardSectionWrapper } from '../dashboard/DashboardSectionWrapper';
import { useTrip } from '../../hooks/useTrip';
import type { Trip } from '../../types/trip';
import type { FormMode } from '../../hooks/useDashboardState';
import { TripForm } from './TripForm';
import { useProfile } from '../../hooks/useProfile';

interface Props {
  selectedTrip?: Trip | null;
  isSubmitting: boolean;
  tripMode: FormMode;
  onSetTripMode: (mode: FormMode) => void;
}

export const TripFormSwitch: React.FC<Props> = ({
  selectedTrip,
  isSubmitting,
  tripMode,
  onSetTripMode,
}) => {
  const { user } = useProfile();
  const { onCreateTrip, onUpdateTrip } = useTrip();

  if (user && tripMode === 'add') {
    return (
      <DashboardSectionWrapper title="Ajouter un Voyage">
        <TripForm
          driverId={user.id}
          defaultValues={null}
          isSubmitting={isSubmitting}
          onSubmit={async (data) => {
            const success = await onCreateTrip(data);
            if (success) onSetTripMode('view');
          }}
          onCancel={() => onSetTripMode('view')}
        />
      </DashboardSectionWrapper>
    );
  }

  if (user && selectedTrip && tripMode === 'edit') {
    return (
      <DashboardSectionWrapper title="Modifier un Voyage">
        <TripForm
          driverId={user.id}
          defaultValues={selectedTrip}
          isSubmitting={isSubmitting}
          onSubmit={async (data) => {
            const success = await onUpdateTrip(selectedTrip.id, data);
            if (success) onSetTripMode('view');
          }}
          onCancel={() => onSetTripMode('view')}
        />
      </DashboardSectionWrapper>
    );
  }

  return null;
};
