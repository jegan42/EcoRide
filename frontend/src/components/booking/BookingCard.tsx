// frontend/src/components/booking/BookingCard.tsx
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Box,
} from '@mui/material';
import type { BookingFull } from '../../types/booking';
import { useIsDriver } from '../../hooks/useIsDriver';
import { useBookingsDialogValidate } from '../../hooks/useBookingsDialogValidate';
import { ConfirmDialog } from '../dailog/ConfirmDialog';
import { TripDetails } from '../trip/TripDetails';
import { type JSX } from 'react';
import { FindTripInfoDriver } from '../findtrip/FindTripInfoDriver';
import { FindTripInfoTrip } from '../findtrip/FindTripInfoTrip';
import { getDialogContent, getDialogTitle } from './BookingDialogContent';
import { BookingDetails } from './BookingDetails';

interface Props {
  booking: BookingFull;
  isDriverBookings?: boolean;
  setOnUpdate: (update: boolean) => void;
  onValidate?: () => void;
}

export const BookingCard = ({
  booking,
  isDriverBookings = false,
  setOnUpdate,
  onValidate,
}: Props): JSX.Element => {
  const isDriver = useIsDriver();
  const { trip, status } = booking;

  const {
    handleOpenBooking,
    handleConfirm,
    selectedBooking,
    submitting,
    handleCloseBooking,
    action,
    setAction,
    rating,
    setRating,
    comment,
    setComment,
    hasReviewed,
  } = useBookingsDialogValidate(onValidate, booking);

  const endingDate = trip?.arrivalDate || 0;

  const canReview =
    !hasReviewed && status === 'confirmed' && new Date(endingDate) < new Date();

  const handleConfirmWithUpdate = async (): Promise<void> => {
    await handleConfirm();
    setOnUpdate(true);
  };

  return (
    <Card>
      <CardContent
        sx={(theme) => ({
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          border: `1px solid ${theme.palette.primary.main}`,
        })}
      >
        {trip && (
          <Stack spacing={2} p={2} sx={{ width: { xs: '100%', sm: '40%' } }}>
            <Typography variant="h6">Détail du voyage</Typography>
            <FindTripInfoDriver driver={trip.driver} />
            <FindTripInfoTrip trip={trip} />
          </Stack>
        )}
        <BookingDetails booking={booking} />

        {canReview && (
          <Box
            textAlign="center"
            p={2}
            sx={{ width: { xs: '100%', sm: '15%' } }}
          >
            <Button
              variant="contained"
              onClick={() => {
                handleOpenBooking(booking);
                setAction('review');
              }}
            >
              Ajouter un avis
            </Button>
          </Box>
        )}

        {status === 'pending' && (
          <Stack
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'column' },
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
          title={`${getDialogTitle(action)} de la réservation`}
          open={!!selectedBooking}
          submitting={submitting}
          onClose={handleCloseBooking}
          onConfirm={() => handleConfirmWithUpdate}
          disabledConfirm={
            action === 'review' && (!rating || !comment || hasReviewed)
          }
        >
          <>
            {trip && <TripDetails trip={trip} />}
            {getDialogContent(action, rating, setRating, comment, setComment)}
          </>
        </ConfirmDialog>
      )}
    </Card>
  );
};
