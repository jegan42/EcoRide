// frontend/src/components/booking/BookingCard.tsx
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  DialogContent,
} from '@mui/material';
import type { BookingFull } from '../../types/booking';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useIsDriver } from '../../hooks/useIsDriver';
import { useBookingsDialogValidate } from '../../hooks/useBookingsDialogValidate';
import { ConfirmDialog } from '../dailog/ConfirmDialog';
import { TripDetails } from '../trip/TripDetails';
import { useState, type JSX } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { FindTripInfoDriver } from '../findtrip/FindTripInfoDriver';
import { FindTripInfoTrip } from '../findtrip/FindTripInfoTrip';

interface Props {
  booking: BookingFull;
  isDriverBookings?: boolean;
  setOnUpdate: (update: boolean) => void;
}

export const BookingCard = ({
  booking,
  isDriverBookings = false,
  setOnUpdate,
}: Props): JSX.Element => {
  const { user: getUser } = useAppSelector((state) => state.auth);
  const isDriver = useIsDriver();
  const isMobile = useIsMobile();
  const { user, trip, seatCount, totalPrice, status, createdAt, updatedAt } =
    booking;
  const [action, setAction] = useState<'accept' | 'reject' | ''>('');
  const isPassenger = user?.id === getUser?.id;

  const {
    handleOpenBooking,
    handleConfirm,
    selectedBooking,
    submitting,
    handleCloseBooking,
  } = useBookingsDialogValidate();

  return (
    <Card>
      <CardContent
        sx={(theme) => ({
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
          border: `1px solid ${theme.palette.primary.main}`,
        })}
      >
        {trip && (
          <Stack spacing={2} p={2} width={isMobile ? '100%' : '40%'}>
            <Typography variant="h6">Détail du voyage</Typography>
            <FindTripInfoDriver driver={trip.driver} />
            <FindTripInfoTrip trip={trip} />
          </Stack>
        )}
        <Stack spacing={2} p={2} width={isMobile ? '100%' : '40%'}>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="h6">Détail de la réservation</Typography>
            <Typography>Passager : {user?.username}</Typography>
            <Typography>{seatCount} siège(s) réservé(s)</Typography>
            <Typography>Prix total : {totalPrice} €</Typography>
            <Typography variant="body2" color="text.secondary">
              Réservée le{' '}
              {createdAt
                ? new Date(createdAt).toLocaleDateString()
                : 'Date inconnue'}
            </Typography>
            {status !== 'pending' && (
              <Typography
                variant="body2"
                color={status === 'cancelled' ? 'error' : 'primary'}
              >
                {status === 'cancelled' ? 'Annulée' : 'Confirmée'} le{' '}
                {updatedAt
                  ? new Date(updatedAt).toLocaleDateString()
                  : 'Date inconnue'}
              </Typography>
            )}
            <Chip
              label={status}
              color={status === 'cancelled' ? 'error' : 'primary'}
            />
          </Stack>
        </Stack>
        {status === 'pending' && (
          <Stack
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              justifyContent: 'space-between',
            }}
          >
            {isDriverBookings && isDriver && (
              <Button
                aria-label="Valider la réservation"
                variant="contained"
                color="primary"
                onClick={() => {
                  handleOpenBooking(booking);
                  setAction('accept');
                }}
              >
                Valider
              </Button>
            )}
            <Button
              aria-label="Annuler la réservation"
              variant="outlined"
              color="primary"
              onClick={() => {
                handleOpenBooking(booking);
                setAction('reject');
              }}
            >
              Annuler
            </Button>
          </Stack>
        )}
      </CardContent>

      {action !== '' && selectedBooking && (
        <ConfirmDialog
          title={`${
            action === 'accept' ? 'Validation' : 'Annulation'
          } de la réservation`}
          open={!!selectedBooking}
          submitting={submitting}
          onClose={handleCloseBooking}
          onConfirm={() => {
            if (submitting) return;
            handleConfirm(isPassenger, selectedBooking, action);
            setOnUpdate(true);
          }}
        >
          <>
            {trip && <TripDetails trip={trip} />}
            <DialogContent>
              <Typography variant="body2">{`Voulez-vous \
              ${action === 'accept' ? 'valider' : 'annuler'} ce voyage ?`}</Typography>
            </DialogContent>
          </>
        </ConfirmDialog>
      )}
    </Card>
  );
};
