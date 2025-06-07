// frontend/src/component/profile/ProfileFormSwitch.tsx
import { DashboardSectionWrapper } from '../dashboard/DashboardSectionWrapper';
import { useProfile } from '../../hooks/useProfile';
import type { FormMode } from '../../hooks/useModes';
import { ProfileForm } from './ProfileForm';

interface Props {
  isSubmitting: boolean;
  profileMode: FormMode;
  onSetProfileMode: (mode: FormMode) => void;
}

export const ProfileFormSwitch: React.FC<Props> = ({
  isSubmitting,
  profileMode,
  onSetProfileMode,
}) => {
  const { onUpdateUser } = useProfile();
  if (profileMode === 'edit') {
    return (
      <DashboardSectionWrapper title="Modifier le Profil">
        <ProfileForm
          isSubmitting={isSubmitting}
          onSubmit={async (data) => {
            const success = await onUpdateUser(data);
            if (success) onSetProfileMode('view');
          }}
          onCancel={() => onSetProfileMode('view')}
        />
      </DashboardSectionWrapper>
    );
  }

  return null;
};
