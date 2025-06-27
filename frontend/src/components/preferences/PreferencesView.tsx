// frontend/src/component/preferences/PreferencesView.tsx
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { usePreferences } from '../../hooks/usePreferences';
import { preferencesLabel } from '../../types/preferences';
import type { DashboardMode } from '../../hooks/useDashboardState';
import type { JSX } from 'react';

interface Props {
  setDashboardMode: (mode: DashboardMode) => void;
}

export const PreferencesView: React.FC<Props> = ({ setDashboardMode }) => {
  const theme = useTheme();
  const { preferences, error } = usePreferences();

  if (!preferences || error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          mt: 2,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {error}
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3, fontSize: { xs: '0.85rem', md: '1rem' } }}
          onClick={() => setDashboardMode('preferencesAdd')}
        >
          Ajouter des préférences
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <Box display="flex" justifyContent="flex-end">
        <IconButton
          aria-label="Modifier les préférences"
          onClick={() => setDashboardMode('preferencesEdit')}
          sx={{ color: theme.palette.primary.main }}
        >
          <EditIcon />
        </IconButton>
      </Box>

      <Stack spacing={1}>
        {preferencesLabel.map(({ value, label }) => (
          <Box
            key={value}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <strong>{label} :</strong>
            {renderPreferenceChoice(Boolean(preferences[value]))}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

const renderPreferenceChoice = (value: boolean): JSX.Element => {
  const color = value ? 'primary.main' : 'error.main';
  const label = value ? 'Accepté' : 'Pas accepté';
  const Icon = value ? CheckBoxIcon : DisabledByDefaultIcon;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color }}>
      <Typography variant="body2">{label}</Typography>
      <Icon fontSize="small" />
    </Box>
  );
};
