// frontend/src/hooks/useBookingsDialogValidate.tsx
import { useEffect, useState } from 'react';
import bookingService from '../services/bookingService';
import {
  enqueueSnackbarError,
  enqueueSnackbarSuccess,
} from '../utils/enqueueSnackbar';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from './useAppSelector';
import type { Booking, BookingFull } from '../types/booking';
import { addReview, hasAlreadyReviewedBooking } from '../services';
import type { Review } from '../types/review';

interface UseBookingsDialogValidateReturn {
  handleOpenBooking: (booking: Partial<Booking>) => void;
  handleConfirm: () => void;
  selectedBooking: Partial<Booking> | null;
  submitting: boolean;
  handleCloseBooking: () => void;
  action: 'accept' | 'reject' | 'review' | '';
  setAction: React.Dispatch<
    React.SetStateAction<'accept' | 'reject' | 'review' | ''>
  >;
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  hasReviewed: boolean;
}

export const useBookingsDialogValidate = (
  onBookingValidate?: () => void,
  booking?: BookingFull
): UseBookingsDialogValidateReturn => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [submitting, setSubmitting] = useState(false);
  const [action, setAction] = useState<'accept' | 'reject' | 'review' | ''>('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hasReviewed, setHasReviewed] = useState<boolean>(true);
  const [selectedBooking, setSelectedBooking] =
    useState<Partial<Booking> | null>(null);

  const isPassenger = selectedBooking?.user?.id === user?.id;

  const endingDate = booking?.trip?.arrivalDate || 0;

  useEffect(() => {
    const checkReview = async (): Promise<void> => {
      if (
        booking?.status === 'confirmed' &&
        new Date(endingDate) < new Date() &&
        user?.id
      ) {
        const reviewed = Boolean(
          booking.id && (await hasAlreadyReviewedBooking(user.id, booking.id))
        );
        setHasReviewed(reviewed);
      }
    };

    void checkReview();
  }, [booking?.status, booking?.id, user?.id, endingDate]);

  const reset = (): void => {
    setSubmitting(false);
    setAction('');
    setRating(0);
    setComment('');
    setHasReviewed(true);
    setSelectedBooking(null);
  };

  const handleOpenBooking = (booking: Partial<Booking>): void => {
    if (!isAuthenticated) {
      void navigate('/signin');
      return;
    }
    setSelectedBooking(booking);
  };

  const handleCloseBooking = (): void => reset();

  const handleConfirm = async (): Promise<void> => {
    if (!selectedBooking || !selectedBooking.id) {
      enqueueSnackbarError(new Error('Réservation invalide.'));
      return;
    }
    try {
      setSubmitting(true);
      if (action === 'accept' || action === 'reject') {
        if (isPassenger) {
          const { message } = await bookingService.cancelBooking(
            selectedBooking.id
          );
          enqueueSnackbarSuccess(message ?? 'Réservation annulée.');
        } else {
          const { message } = await bookingService.validateBooking(
            selectedBooking.id,
            action
          );
          enqueueSnackbarSuccess(
            message ??
              `Réservation ${action === 'accept' ? 'validée' : 'annulée'}.`
          );
        }
      } else if (action === 'review') {
        const newReview: Review = {
          authorId: user?.id ?? '',
          targetId: isPassenger
            ? (selectedBooking.trip?.driverId ?? '')
            : (selectedBooking.user?.id ?? ''),
          tripId: selectedBooking.trip?.id ?? '',
          bookingId: selectedBooking.id,
          rating,
          comment,
        };

        const res = await addReview(newReview);

        if (res.data) {
          enqueueSnackbarSuccess('Avis soumis avec succès.');
        } else {
          throw new Error(res.message || 'Erreur lors de la soumission.');
        }
      } else {
        enqueueSnackbarError(new Error(`Action inconnue : ${action}`));
      }
      handleCloseBooking();
      onBookingValidate?.();
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
    action,
    setAction,
    rating,
    setRating,
    comment,
    setComment,
    hasReviewed,
  };
};
