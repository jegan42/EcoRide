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
import type { FormMode } from '../../hooks/useModes';
import type { JSX } from 'react';

interface Props {
  onSetPreferencesMode: (mode: FormMode) => void;
}

export const PreferencesView: React.FC<Props> = ({ onSetPreferencesMode }) => {
  const theme = useTheme();
  const { preferences } = usePreferences();

  if (!preferences) {
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
          Vous n’avez encore enregistré aucune préférence.
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3, fontSize: { xs: '0.85rem', md: '1rem' } }}
          onClick={() => onSetPreferencesMode('add')}
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
          onClick={() => onSetPreferencesMode('edit')}
          sx={{ color: theme.palette.primary.main }}
        >
          <EditIcon />
        </IconButton>
      </Box>

      <Stack spacing={1}>
        {preferencesLabel.map(({ value, label }) => (
          <Typography
            key={value}
            variant="body2"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <strong>{label} :</strong>
            {renderPreferenceChoice(Boolean(preferences[value]))}
          </Typography>
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
