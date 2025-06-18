// frontend/src/hooks/useBookingsDialog.tsx
import { useState } from 'react';
import type { Trip } from '../types/trip';
import bookingService from '../services/bookingService';
import {
  enqueueSnackbarError,
  enqueueSnackbarSuccess,
} from '../utils/enqueueSnackbar';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from './useAppSelector';

export const useBookingsDialog = (): {
  handleOpenBooking: (trip: Partial<Trip>) => void;
  handleConfirm: (trip: Partial<Trip>) => void;
  dialogTrip: Partial<Trip> | null;
  submitting: boolean;
  handleCloseBooking: () => void;
  seats: number;
  setSeats: React.Dispatch<React.SetStateAction<number>>;
} => {
  const navigate = useNavigate();
  const [seats, setSeats] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [dialogTrip, setDialogTrip] = useState<Partial<Trip> | null>(null);
  const handleOpenBooking = (trip: Partial<Trip>): void => {
    if (!isAuthenticated) {
      void navigate('/signin');
      return;
    }
    setDialogTrip(trip);
  };

  const handleCloseBooking = (): void => {
    setDialogTrip(null);
    setSeats(1);
  };

  const handleConfirm = async (trip: Partial<Trip>): Promise<void> => {
    if (!trip.id) {
      enqueueSnackbarError(
        new Error('Erreur de réservation : ID du trajet manquant.')
      );
      return;
    }
    const maxSeats = trip.availableSeats || 1;
    if (seats < 1 || seats > maxSeats) {
      enqueueSnackbarError(new Error('Nombre de places invalide.'));
      return;
    }
    try {
      setSubmitting(true);
      const { message } = await bookingService.createBooking({
        tripId: trip.id,
        seatCount: seats,
      });
      enqueueSnackbarSuccess(message ?? 'Réservation effectuée.');
      handleCloseBooking();
    } catch (error) {
      enqueueSnackbarError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    handleOpenBooking,
    handleConfirm,
    dialogTrip,
    submitting,
    handleCloseBooking,
    seats,
    setSeats,
  };
};
