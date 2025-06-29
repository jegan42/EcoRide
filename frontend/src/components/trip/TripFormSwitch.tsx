// frontend/src/component/trip/TripFormSwitch.tsx
import { DashboardSectionWrapper } from '../dashboard/DashboardSectionWrapper';
import { useTrip } from '../../hooks/useTrip';
import type { Trip } from '../../types/trip';
import type { DashboardMode } from '../../hooks/useDashboardState';
import { TripForm } from './TripForm';
import { useProfile } from '../../hooks/useProfile';
import { ConfirmDialog } from '../dailog/ConfirmDialog';
import { formatDateTime } from '../../utils/formatDateTime';

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

  const handleConfirmStart = async (): Promise<void> => {
    const { id, ...trip } = selectedData as Trip;
    const newStatus = dashboardMode === 'tripStart' ? 'start' : 'arrived';
    if (!id) return;
    const success = await onUpdateTrip(id, { ...trip, status: newStatus });
    if (success) setDashboardMode('tripView');
  };

  const titleDialog =
    dashboardMode === 'tripStart'
      ? 'Démarrage'
      : dashboardMode === 'tripArrived'
        ? 'Arrivée'
        : '';

  const messageDialog =
    dashboardMode === 'tripStart'
      ? 'a démarré'
      : dashboardMode === 'tripArrived'
        ? 'est terminé'
        : '';

  if (!user) return null;

  if (dashboardMode === 'tripAdd') {
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

  if (selectedData) {
    if (dashboardMode === 'tripEdit') {
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
    if (dashboardMode === 'tripStart' || dashboardMode === 'tripArrived') {
      return (
        <ConfirmDialog
          title={`${titleDialog} d’un Voyage`}
          open={true}
          onClose={() => setDashboardMode('tripView')}
          onConfirm={handleConfirmStart}
          message={`Le voyage ${selectedData.departureCity} → ${selectedData.arrivalCity} \
                   du ${formatDateTime(selectedData.departureDate)} au ${formatDateTime(selectedData.arrivalDate)} ${messageDialog} ?`}
        />
      );
    }
  }

  return null;
};
