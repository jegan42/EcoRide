// frontend/src/components/booking/BookingCard.tsx
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Box,
} from '@mui/material';
import type { Booking } from '../../types/booking';
import { useIsDriver } from '../../hooks/useIsDriver';
import { useBookingsDialogValidate } from '../../hooks/useBookingsDialogValidate';
import { ConfirmDialog } from '../dailog/ConfirmDialog';
import { TripDetails } from '../trip/TripDetails';
import { FindTripInfoDriver } from '../findtrip/FindTripInfoDriver';
import { FindTripInfoTrip } from '../findtrip/FindTripInfoTrip';
import { getDialogContent, getDialogTitle } from './BookingDialogContent';
import { BookingDetails } from './BookingDetails';

interface Props {
  booking: Booking;
  isDriverBookings?: boolean;
  setOnUpdate: (update: boolean) => void;
  onValidate?: () => void;
}

export const BookingCard: React.FC<Props> = ({
  booking,
  isDriverBookings = false,
  setOnUpdate,
  onValidate,
}) => {
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
    canReview,
  } = useBookingsDialogValidate(onValidate, booking);

  const handleConfirmWithUpdate = (): void => {
    handleConfirm();
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
          borderRadius: 1,
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
            sx={{
              width: { xs: '100%', sm: '15%' },
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'column' },
              justifyContent: 'space-between',
            }}
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
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleOpenBooking(booking);
                setAction('no_show');
              }}
            >
              Pas présent
            </Button>
          </Box>
        )}

        {status === 'pending' && (
          <Stack
            sx={{
              width: { xs: '100%', sm: '15%' },
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
          onConfirm={handleConfirmWithUpdate}
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
