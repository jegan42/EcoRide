// frontend/src/components/admin/AdminUserCard.tsx
import React from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import type { User } from '../../types/user';
import type { AdminFormMode } from '../../types/admin';

interface Props {
  user: User;
  onEdit: (mode: AdminFormMode) => void;
  onSetSelectedUser: (user: User) => void;
}

export const AdminUserCard: React.FC<Props> = ({
  user,
  onEdit,
  onSetSelectedUser,
}) => {
  return (
    <Card
      elevation={3}
      sx={(theme) => ({
        gap: 2,
        mt: 4,
        borderRadius: 3,
        border: `2px solid ${theme.palette.primary.main}`,
        borderLeft: `${user.role.includes('suspended') ? '5px solid #f44336' : ''}`,
      })}
    >
      <CardContent>
        <Box
          display={'flex'}
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent={'space-between'}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            width={{ xs: '100%', sm: '30%' }}
          >
            <Avatar src={user.avatar} sx={{ width: 80, height: 80 }} />
            <Box>
              <Typography variant="h6">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Stack>

          <Box mt={2} width={{ xs: '100%', sm: '30%' }}>
            <Typography>
              <strong>Nom d’utilisateur :</strong> {user.username}
            </Typography>
            <Typography>
              <strong>Téléphone :</strong> {user.phone}
            </Typography>
            <Typography>
              <strong>Adresse :</strong> {user.address}
            </Typography>
            <Typography>
              <strong>Crédits :</strong> {user.credits}
            </Typography>
            <Typography>
              <strong>Dernière connexion :</strong>{' '}
              {new Date(user.lastLogin).toLocaleString()}
            </Typography>
            <Typography>
              <strong>Créé le :</strong>{' '}
              {new Date(user.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Box mt={1} width={{ xs: '100%', sm: '25%' }}>
            <Typography>
              <strong>Rôles :</strong>
            </Typography>
            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
              {user.role.map((r) => (
                <Chip
                  key={r}
                  label={r}
                  color={r.includes('suspended') ? 'error' : 'primary'}
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>
          <Stack
            direction="column"
            alignItems="center"
            justifyContent={'space-between'}
          >
            <IconButton
              aria-label="edit"
              onClick={() => {
                onEdit('userEdit');
                onSetSelectedUser(user);
              }}
              sx={(theme) => ({ color: theme.palette.primary.main })}
            >
              <EditIcon />
            </IconButton>
            {!user.role.includes('suspended') && (
              <IconButton
                aria-label="cancel"
                onClick={() => {
                  onEdit('userDelete');
                  onSetSelectedUser(user);
                }}
                sx={(theme) => ({ color: theme.palette.error.main })}
              >
                <DeleteForeverIcon />
              </IconButton>
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};
