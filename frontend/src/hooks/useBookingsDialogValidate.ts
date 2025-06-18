// frontend/src/hooks/useBookingsDialogValidate.tsx
import { useState } from 'react';
import bookingService from '../services/bookingService';
import {
  enqueueSnackbarError,
  enqueueSnackbarSuccess,
} from '../utils/enqueueSnackbar';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from './useAppSelector';
import type { Booking } from '../types/booking';

type BookingValidationAction = 'accept' | 'reject';

export const useBookingsDialogValidate = (
  onBookingValidate?: () => void
): {
  handleOpenBooking: (booking: Partial<Booking>) => void;
  handleConfirm: (
    isPassenger: boolean,
    booking: Partial<Booking>,
    action: BookingValidationAction
  ) => void;
  selectedBooking: Partial<Booking> | null;
  submitting: boolean;
  handleCloseBooking: () => void;
} => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [selectedBooking, setSelectedBooking] =
    useState<Partial<Booking> | null>(null);
  const handleOpenBooking = (booking: Partial<Booking>): void => {
    if (!isAuthenticated) {
      void navigate('/signin');
      return;
    }
    setSelectedBooking(booking);
  };

  const handleCloseBooking = (): void => setSelectedBooking(null);

  const handleConfirm = async (
    isPassenger: boolean,
    booking: Partial<Booking>,
    action: BookingValidationAction
  ): Promise<void> => {
    if (!booking.id) {
      enqueueSnackbarError(new Error('Réservation invalide.'));
      return;
    }
    try {
      setSubmitting(true);
      if (isPassenger) {
        const { message } = await bookingService.cancelBooking(booking.id);
        enqueueSnackbarSuccess(message ?? 'Réservation annulée.');
      } else {
        const { message } = await bookingService.validateBooking(
          booking.id,
          action
        );
        enqueueSnackbarSuccess(
          message ??
            `Réservation ${action === 'accept' ? 'validée' : 'annulée'}.`
        );
      }
      handleCloseBooking();
      if (onBookingValidate) onBookingValidate();
    } catch (error) {
      enqueueSnackbarError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    handleOpenBooking,
    handleConfirm,
    selectedBooking,
    submitting,
    handleCloseBooking,
  };
};
