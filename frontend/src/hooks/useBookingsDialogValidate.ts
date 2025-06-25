// frontend/src/hooks/useBookingsDialogValidate.tsx
import { useEffect, useState } from 'react';
import bookingService from '../services/bookingService';
import {
  enqueueSnackbarError,
  enqueueSnackbarSuccess,
} from '../utils/enqueueSnackbar';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from './useAppSelector';
import type { Booking } from '../types/booking';
import { addHistory, buildHistory, hasAlreadyHistory } from '../services';
import type { Review } from '../types/review';
import type { History, HistoryStatusEnum } from '../types/history';
import reviewsService from '../services/reviewsService';

interface UseBookingsDialogValidateReturn {
  handleOpenBooking: (booking: Booking) => void;
  handleConfirm: () => void;
  selectedBooking: Booking | null;
  submitting: boolean;
  handleCloseBooking: () => void;
  action: 'accept' | 'reject' | 'review' | 'no_show' | '';
  setAction: React.Dispatch<
    React.SetStateAction<'accept' | 'reject' | 'review' | 'no_show' | ''>
  >;
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  hasReviewed: boolean;
  canReview: boolean;
}

const actionToHistoryStatus: Record<string, HistoryStatusEnum> = {
  reject: 'cancelled',
  review: 'completed',
  no_show: 'no_show',
};

export const useBookingsDialogValidate = (
  onBookingValidate?: () => void,
  booking?: Booking
): UseBookingsDialogValidateReturn => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [submitting, setSubmitting] = useState(false);
  const [action, setAction] = useState<
    'accept' | 'reject' | 'review' | 'no_show' | ''
  >('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hasReviewed, setHasReviewed] = useState<boolean>(true);
  const [hasHistory, setHasHistory] = useState<boolean>(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const isPassenger = selectedBooking?.user?.id === user?.id;

  const endingDate = booking?.trip?.arrivalDate || 0;

  const canReview =
    !hasReviewed &&
    !hasHistory &&
    booking?.status === 'confirmed' &&
    new Date(endingDate) < new Date();

  useEffect(() => {
    const checkReview = async (): Promise<void> => {
      if (
        booking?.status === 'confirmed' &&
        new Date(endingDate) < new Date() &&
        user?.id
      ) {
        const reviewed = Boolean(
          booking.id &&
            (await reviewsService.hasAlreadyReviewedBooking(
              user.id,
              booking.id
            ))
        );
        setHasReviewed(reviewed);
        const history = Boolean(
          booking.trip?.id &&
            (await hasAlreadyHistory(user.id, booking.trip.id, booking.id))
        );
        setHasHistory(history);
      }
    };

    void checkReview();
  }, [booking?.status, booking?.id, booking?.trip?.id, user?.id, endingDate]);

  const reset = (): void => {
    setSubmitting(false);
    setAction('');
    setRating(0);
    setComment('');
    setHasReviewed(true);
    setSelectedBooking(null);
  };

  const handleOpenBooking = (booking: Booking): void => {
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
        const newReview: Review = reviewsService.buildReview(
          user?.id ?? '',
          selectedBooking,
          action,
          rating,
          comment
        );

        const res = await reviewsService.addReview(newReview);

        if (res.data) {
          enqueueSnackbarSuccess('Avis soumis avec succès.');
        } else {
          throw new Error(res.message || 'Erreur lors de la soumission.');
        }
      } else {
        enqueueSnackbarError(new Error(`Action inconnue : ${action}`));
      }
      const status = actionToHistoryStatus[action];

      if (status) {
        const newHistory: History = buildHistory(
          user?.id ?? '',
          selectedBooking,
          status,
          isPassenger ? 'passenger' : 'driver'
        );

        if (!newHistory.tripId) {
          console.warn('Trip ID manquant pour l’historique');
        }

        await addHistory(newHistory);
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
    canReview,
  };
};
