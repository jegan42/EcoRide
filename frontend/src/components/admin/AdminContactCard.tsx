// frontend/src/components/admin/AdminContactCard.tsx
import React from 'react';
import { Box, Paper, Typography, Stack, Button, Chip } from '@mui/material';
import type { Contact } from '../../types/contact';
import { formatTimestampToDate } from '../../utils/formatDateTime';

interface Props {
  contact: Contact;
  onAnswer?: (contact: Contact) => void;
  onDelete?: (id: string) => void;
}

export const AdminContactCard: React.FC<Props> = ({
  contact,
  onAnswer,
  onDelete,
}) => {
  return (
    <Paper
      elevation={3}
      sx={(theme) => ({
        p: 2,
        gap: 2,
        mt: 4,
        borderRadius: 3,
        border: `2px solid ${theme.palette.primary.main}`,
        borderLeft: `${contact.status === 'unread' ? '5px solid #f44336' : ''}`,
      })}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent={'space-between'}
      >
        <Box>
          <Stack direction={'row'} spacing={4} alignItems="center">
            <Chip
              label={contact.status === 'unread' ? 'Non lu' : 'Répondu'}
              color={contact.status === 'unread' ? 'warning' : 'success'}
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              De : <strong>{contact.email}</strong>
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {formatTimestampToDate(contact.sentAt)}
            </Typography>
          </Stack>
          <Box>
            <Typography variant="h6">Sujet : {contact.subject}</Typography>
            <Typography variant="body1">Message : {contact.message}</Typography>
          </Box>
        </Box>
        <Stack direction={{ xs: 'row', sm: 'column' }} spacing={1}>
          {onAnswer && contact.status === 'unread' && (
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => onAnswer(contact)}
            >
              Marquer comme répondu
            </Button>
          )}

          {onDelete && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              fullWidth
              onClick={() => onDelete(contact.id!)}
            >
              Supprimer
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};
