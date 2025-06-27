// frontend/src/component/profile/ProfileFormSwitch.tsx
import { DashboardSectionWrapper } from '../dashboard/DashboardSectionWrapper';
import { useProfile } from '../../hooks/useProfile';
import type { DashboardMode } from '../../hooks/useDashboardState';
import { ProfileForm } from './ProfileForm';

interface Props {
  isSubmitting: boolean;
  dashboardMode: DashboardMode;
  setDashboardMode: (mode: DashboardMode) => void;
}

export const ProfileFormSwitch: React.FC<Props> = ({
  isSubmitting,
  dashboardMode,
  setDashboardMode,
}) => {
  const { onUpdateUser } = useProfile();
  if (dashboardMode.includes('Edit')) {
    return (
      <DashboardSectionWrapper title="Modifier le Profil">
        <ProfileForm
          isSubmitting={isSubmitting}
          onSubmit={async (data) => {
            const success = await onUpdateUser(data);
            if (success) setDashboardMode('profilView');
          }}
          onCancel={() => setDashboardMode('profilView')}
        />
      </DashboardSectionWrapper>
    );
  }

  return null;
};
