// frontend/src/component/profile/ProfileView.tsx
import React, { type JSX } from 'react';
import { Typography, Button, Stack, Box } from '@mui/material';
import { ProfileTabs, type ProfileTabsMode } from './ProfileTabs';
import { useProfile } from '../../hooks/useProfile';

interface Props {
  onSetProfileMode: () => void;
  onSetVehicleMode: () => void;
  profileTabs: ProfileTabsMode;
  onSetProfileTabs: (mode: ProfileTabsMode) => void;
}

export const ProfileView: React.FC<Props> = ({
  onSetProfileMode,
  onSetVehicleMode,
  profileTabs,
  onSetProfileTabs,
}): JSX.Element => {
  const { user } = useProfile();
  return (
    <>
      <Box sx={{ display: 'flex', width: '80%', mx: 'auto' }}>
        <Stack spacing={1} width="100%" mt={2}>
          <Info label="Prénom" value={user?.firstName} />
          <Info label="Nom" value={user?.lastName} />
          <Info label="Email" value={user?.email} />
          <Info label="Crédits" value={user?.credits?.toString()} />
        </Stack>
        <Stack spacing={1} width="100%" mt={2}>
          <Info label="Téléphone" value={user?.phone} />
          <Info label="Adresse" value={user?.address} />
          <Info label="Rôles" value={user?.role?.join(', ')} />
          <Info
            label="Dernière connexion"
            value={user?.lastLogin && new Date(user.lastLogin).toLocaleString()}
          />
        </Stack>
      </Box>
      <Box
        sx={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}
      >
        <Button
          variant="contained"
          sx={{ mt: 4, fontSize: { xs: '0.8rem', md: '1rem' } }}
          onClick={onSetProfileMode}
        >
          Modifier mon profil
        </Button>
        <Button
          variant="contained"
          sx={{ mt: 4, fontSize: { xs: '0.8rem', md: '1rem' } }}
          onClick={onSetVehicleMode}
        >
          Ajouter un véhicule
        </Button>
      </Box>
      <Box sx={{ mt: 4 }}>
        <ProfileTabs profileTabs={profileTabs} onChange={onSetProfileTabs} />
      </Box>
    </>
  );
};

const Info = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}): JSX.Element => (
  <Typography variant="body2">
    <strong>{label} :</strong> {value}
  </Typography>
);
