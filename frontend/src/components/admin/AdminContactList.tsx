// frontend/src/components/admin/AdminContactList.tsx
import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { AdminContactCard } from '../../components/admin/AdminContactCard';
import type { Contact } from '../../types/contact';
import type { AdminFormMode } from '../../types/admin';

interface Props {
  setViewMode: (mode: AdminFormMode) => void;
  allContacts: Contact[];
  setSelectedContact: (contact: Contact) => void;
}

export const AdminContactList: React.FC<Props> = ({
  setViewMode,
  allContacts,
  setSelectedContact,
}) => {
  return (
    <Stack spacing={2} mt={4}>
      <Typography variant="h5" gutterBottom>
        Liste des messages
      </Typography>
      {allContacts.map((contact) => {
        return (
          <Box key={contact.id}>
            <AdminContactCard
              contact={contact}
              onAnswer={() => {
                setViewMode('contactEdit');
                setSelectedContact(contact);
              }}
              onDelete={undefined}
            />
          </Box>
        );
      })}
    </Stack>
  );
};
