// frontend/src/components/booking/BookingDialogContent.tsx
import { DialogContent, Typography } from '@mui/material';
import { ReviewForm } from '../review/ReviewForm';
import type { JSX } from 'react';

export const getDialogTitle = (action: string): string => {
  switch (action) {
    case 'accept':
      return 'Validation';
    case 'reject':
      return 'Annulation';
    case 'review':
      return 'Un avis';
    default:
      return '';
  }
};

export const getDialogContent = (
  action: string,
  rating: number,
  setRating: (n: number) => void,
  comment: string,
  setComment: (s: string) => void
): JSX.Element => {
  if (action === 'review') {
    return (
      <DialogContent>
        <ReviewForm
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
        />
      </DialogContent>
    );
  }

  const label =
    action === 'accept'
      ? 'valider'
      : action === 'reject'
        ? 'annuler'
        : 'continuer';

  return (
    <DialogContent>
      <Typography variant="body2">
        {`Voulez-vous ${label} ce voyage ?`}
      </Typography>
    </DialogContent>
  );
};
