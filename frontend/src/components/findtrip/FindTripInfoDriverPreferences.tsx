// frontend/src/component/findtrip/FindTripInfoDriverPreferences.tsx
import { Stack, Skeleton } from '@mui/material';
import { formatField } from '../../utils/formatField';
import { TripInfoRow } from './TripInfoRow';
import { useEffect, useState } from 'react';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import PetsIcon from '@mui/icons-material/Pets';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ChatIcon from '@mui/icons-material/Chat';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import userPreferencesService from '../../services/userPreferencesService';
import type { UserPreferences } from '../../types/preferences';
import { enqueueSnackbarError } from '../../utils/enqueueSnackbar';

interface Props {
  id?: string;
  allInfo?: boolean;
}

export const FindTripInfoDriverPreferences: React.FC<Props> = ({ id }) => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPreferences = async (): Promise<void> => {
      if (!id) {
        console.warn('Pas de userId disponible pour ce véhicule');
        return;
      }
      setLoading(true);
      try {
        const { data } =
          await userPreferencesService.fetchUserPreferencesById(id);
        setPreferences(data);
      } catch (err) {
        console.error('Erreur fetch prefs', err);
        enqueueSnackbarError('Échec de la récupération des préférences.');
      } finally {
        setLoading(false);
      }
    };

    void fetchPreferences();
  }, [id]);

  if (loading) {
    return (
      <Stack spacing={2}>
        {[...Array(4)].map(() => (
          <Skeleton
            variant="rectangular"
            height={40}
            key={crypto.randomUUID()}
          />
        ))}
      </Stack>
    );
  }

  if (!preferences) {
    return (
      <Stack sx={{ mx: 'auto' }}>
        <TripInfoRow
          icon={
            <ManageAccountsIcon
              sx={(theme) => ({ color: theme.palette.primary.dark })}
            />
          }
          label={'Préférences non disponibles.'}
          value=""
        />
      </Stack>
    );
  }

  const booleanLabel = (value?: boolean): string =>
    formatField(value ? 'Oui' : 'Non');

  return (
    <Stack direction="column" spacing={2} sx={{ mx: 'auto' }}>
      <TripInfoRow
        icon={
          <SmokingRoomsIcon
            sx={(theme) => ({ color: theme.palette.primary.dark })}
          />
        }
        label="Accepte les fumeurs :"
        value={booleanLabel(preferences.acceptsSmoker)}
      />
      <TripInfoRow
        icon={
          <PetsIcon sx={(theme) => ({ color: theme.palette.primary.dark })} />
        }
        label="Accepte les animaux :"
        value={booleanLabel(preferences.acceptsPets)}
      />
      <TripInfoRow
        icon={
          <MusicNoteIcon
            sx={(theme) => ({ color: theme.palette.primary.dark })}
          />
        }
        label="Accepte la musique :"
        value={booleanLabel(preferences.acceptsMusic)}
      />
      <TripInfoRow
        icon={
          <ChatIcon sx={(theme) => ({ color: theme.palette.primary.dark })} />
        }
        label="Accepte la conversation :"
        value={booleanLabel(preferences.acceptsChatter)}
      />
    </Stack>
  );
};
