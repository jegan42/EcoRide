// frontend/src/component/preferences/PreferencesFormSwitch.tsx
import { DashboardSectionWrapper } from '../dashboard/DashboardSectionWrapper';
import type { FormMode } from '../../hooks/useDashboardState';
import { PreferencesForm } from './PreferencesForm';
import { usePreferences } from '../../hooks/usePreferences';

interface Props {
  isSubmitting: boolean;
  preferencesMode: FormMode;
  onSetPreferencesMode: (mode: FormMode) => void;
}

export const PreferencesFormSwitch: React.FC<Props> = ({
  isSubmitting,
  preferencesMode,
  onSetPreferencesMode,
}) => {
  const { preferences, onCreatePreferences, onUpdatePreferences } =
    usePreferences();

  switch (preferencesMode) {
    case 'add':
      return (
        <DashboardSectionWrapper title="Ajouter les préférences">
          <PreferencesForm
            key={preferencesMode}
            isSubmitting={isSubmitting}
            onSubmit={async (data) => {
              const success = await onCreatePreferences(data);
              if (success) onSetPreferencesMode('view');
            }}
            onCancel={() => onSetPreferencesMode('view')}
          />
        </DashboardSectionWrapper>
      );

    case 'edit':
      if (!preferences) return null;
      return (
        <DashboardSectionWrapper title="Modifier les préférences">
          <PreferencesForm
            key={preferencesMode}
            defaultValues={preferences}
            isSubmitting={isSubmitting}
            onSubmit={async (data) => {
              const success = await onUpdatePreferences(data);
              if (success) onSetPreferencesMode('view');
            }}
            onCancel={() => onSetPreferencesMode('view')}
          />
        </DashboardSectionWrapper>
      );
    default:
      return null;
  }
};
