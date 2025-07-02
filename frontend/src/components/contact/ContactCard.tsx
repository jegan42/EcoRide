// frontend/src/components/contact/ContactCard.tsx
import React from 'react';
import { Box, Paper, Typography, Stack, Button, Chip } from '@mui/material';
import type { Contact } from '../../types/contact';
import { formatTimestampToDate } from '../../utils/formatDateTime';
import theme from '../../styles/theme';

interface Props {
  contact: Contact;
  onAnswer?: (contact: Contact) => void;
  onDelete?: (id: string) => void;
}

export const ContactCard: React.FC<Props> = ({
  contact,
  onAnswer,
  onDelete,
}) => {
  let borderColor: string = theme.palette.error.main;
  if (contact.status === 'unread') {
    borderColor = theme.palette.warning.main;
  } else if (contact.status === 'answered') {
    borderColor = theme.palette.primary.main;
  }

  const paperBorderLeft = `5px solid ${borderColor}`;

  let label: string = 'Ne pas répondre';
  if (contact.status === 'unread') {
    label = 'Non lu';
  } else if (contact.status === 'answered') {
    label = 'Répondu';
  }

  let color: 'error' | 'success' | 'warning' = 'error';
  if (contact.status === 'unread') {
    color = 'warning';
  } else if (contact.status === 'answered') {
    color = 'success';
  }

  return (
    <Paper
      elevation={3}
      sx={(theme) => ({
        p: 2,
        gap: 2,
        mt: 4,
        borderRadius: 3,
        border: `2px solid ${theme.palette.primary.main}`,
        borderLeft: paperBorderLeft,
      })}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent={'space-between'}
      >
        <Box>
          <Stack direction={'row'} spacing={4} alignItems="center">
            <Chip label={label} color={color} size="small" />
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
        <Stack
          direction={{ xs: 'row', sm: 'column' }}
          spacing={1}
          width={{ xs: '100%', sm: '10rem' }}
        >
          {onAnswer && contact.status !== 'answered' && (
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => onAnswer(contact)}
            >
              Répondre
            </Button>
          )}

          {onDelete && contact.status === 'unread' && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              fullWidth
              onClick={() => onDelete(contact.id!)}
            >
              Ne pas répondre
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};
