// frontend/src/components/booking/BookingDetails.tsx
import { Stack, Typography, Chip } from '@mui/material';
import type { Booking } from '../../types/booking';
import type { JSX } from 'react';

interface Props {
  booking: Booking;
}

export const BookingDetails = ({ booking }: Props): JSX.Element => {
  const { user, seatCount, totalPrice, status, createdAt, updatedAt } = booking;

  const formattedCreatedAt = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : 'Date inconnue';

  const formattedUpdatedAt = updatedAt
    ? new Date(updatedAt).toLocaleDateString()
    : 'Date inconnue';

  return (
    <Stack spacing={2} p={2} sx={{ width: { xs: '100%', sm: '40%' } }}>
      <Typography variant="h6">Détail de la réservation</Typography>

      <Typography>Passager : {user?.username ?? 'Inconnu'}</Typography>
      <Typography>{seatCount} siège(s) réservé(s)</Typography>
      <Typography>Prix total : {Number(totalPrice).toFixed(2)} €</Typography>

      <Typography variant="body2" color="text.secondary">
        Réservée le {formattedCreatedAt}
      </Typography>

      {status !== 'pending' && (
        <Typography
          variant="body2"
          color={status === 'cancelled' ? 'error' : 'primary'}
        >
          {status === 'cancelled' ? 'Annulée' : 'Confirmée'} le{' '}
          {formattedUpdatedAt}
        </Typography>
      )}

      <Chip
        label={status}
        color={status === 'cancelled' ? 'error' : 'primary'}
      />
    </Stack>
  );
};
