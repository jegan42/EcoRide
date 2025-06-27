// frontend/src/component/preferences/PreferencesFormSwitch.tsx
import { DashboardSectionWrapper } from '../dashboard/DashboardSectionWrapper';
import type { DashboardMode } from '../../hooks/useDashboardState';
import { PreferencesForm } from './PreferencesForm';
import { usePreferences } from '../../hooks/usePreferences';

interface Props {
  isSubmitting: boolean;
  dashboardMode: DashboardMode;
  setDashboardMode: (mode: DashboardMode) => void;
}

export const PreferencesFormSwitch: React.FC<Props> = ({
  isSubmitting,
  dashboardMode,
  setDashboardMode,
}) => {
  const { preferences, onCreatePreferences, onUpdatePreferences } =
    usePreferences();

  switch (dashboardMode) {
    case 'preferencesAdd':
      return (
        <DashboardSectionWrapper title="Ajouter les préférences">
          <PreferencesForm
            key={dashboardMode}
            isSubmitting={isSubmitting}
            onSubmit={async (data) => {
              const success = await onCreatePreferences(data);
              if (success) setDashboardMode('preferencesView');
            }}
            onCancel={() => setDashboardMode('preferencesView')}
          />
        </DashboardSectionWrapper>
      );

    case 'preferencesEdit':
      if (!preferences) return null;
      return (
        <DashboardSectionWrapper title="Modifier les préférences">
          <PreferencesForm
            key={dashboardMode}
            defaultValues={preferences}
            isSubmitting={isSubmitting}
            onSubmit={async (data) => {
              const success = await onUpdatePreferences(data);
              if (success) setDashboardMode('preferencesView');
            }}
            onCancel={() => setDashboardMode('preferencesView')}
          />
        </DashboardSectionWrapper>
      );
    default:
      return null;
  }
};
