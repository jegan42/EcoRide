// frontend/src/components/contact/ContactList.tsx
import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { ContactCard } from './ContactCard';
import type { Contact } from '../../types/contact';
import type { AdminFormMode } from '../../types/admin';
import { useAdmin } from '../../hooks/useAdmin';

interface Props {
  setViewMode?: (mode: AdminFormMode) => void;
  setSelectedContact?: (contact: Contact) => void;
}

export const ContactList: React.FC<Props> = ({
  setViewMode,
  setSelectedContact,
}) => {
  const { allContacts } = useAdmin();
  const noop = (): void => {};

  const hasActions = setViewMode && setSelectedContact;

  const onAnswer = hasActions
    ? (contact: Contact) => {
        setViewMode('contactEdit');
        setSelectedContact(contact);
      }
    : noop;

  const onDelete = hasActions
    ? (contact: Contact) => {
        setViewMode('contactDelete');
        setSelectedContact(contact);
      }
    : noop;

  return (
    <Stack spacing={2} mt={4}>
      <Typography variant="h5" gutterBottom>
        Liste des messages
      </Typography>
      {allContacts.map((contact) => {
        return (
          <Box key={contact.id}>
            <ContactCard
              contact={contact}
              onAnswer={() => onAnswer(contact)}
              onDelete={() => onDelete(contact)}
            />
          </Box>
        );
      })}
    </Stack>
  );
};
