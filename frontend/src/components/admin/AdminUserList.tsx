// frontend/src/components/admin/AdminUserList.tsx
import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { AdminUserCard } from './AdminUserCard';
import type { User } from '../../types/user';
import type { AdminFormMode } from '../../types/admin';
import { useAdmin } from '../../hooks/useAdmin';

interface Props {
  setViewMode: (mode: AdminFormMode) => void;
  setSelectedUser: (user: User) => void;
}

export const AdminUserList: React.FC<Props> = ({
  setViewMode,
  setSelectedUser,
}) => {
  const { allUsers } = useAdmin();
  return (
    <Stack spacing={2} mt={4}>
      <Typography variant="h5" gutterBottom>
        Liste des utilisateurs
      </Typography>
      {allUsers.map((user) => {
        return (
          <Box key={user.id}>
            <AdminUserCard
              user={user}
              onEdit={setViewMode}
              onSetSelectedUser={setSelectedUser}
            />
          </Box>
        );
      })}
    </Stack>
  );
};
