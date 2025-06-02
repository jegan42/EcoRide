// frontend/src/pages/Profile/ProfileView.tsx
import React, { type JSX } from 'react';
import { Typography, Button, Stack } from '@mui/material';
import type { User } from '../../types/user';

interface Props {
  user: Partial<User> | null;
  setIsEditing: () => void;
}

const ProfileView: React.FC<Props> = ({ user, setIsEditing }): JSX.Element => {
  return (
    <>
      <Stack spacing={1} width="100%" mt={2}>
        <>
          <Info label="Prénom" value={user?.firstName} />
          <Info label="Nom" value={user?.lastName} />
          <Info label="Email" value={user?.email} />
          {user?.phone && <Info label="Téléphone" value={user.phone} />}
          {user?.address && <Info label="Adresse" value={user.address} />}
          <Info label="Crédits" value={user?.credits?.toString()} />
          <Info
            label="Rôles"
            value={user?.role?.join(', ') || 'Non renseigné'}
          />
          <Info
            label="Dernière connexion"
            value={
              user?.lastLogin
                ? new Date(user.lastLogin).toLocaleString()
                : 'Non disponible'
            }
          />
        </>
      </Stack>

      <Button variant="contained" sx={{ mt: 4 }} onClick={setIsEditing}>
        Modifier mon profil
      </Button>
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
    <strong>{label} :</strong> {value || 'Non renseigné'}
  </Typography>
);

export default ProfileView;
