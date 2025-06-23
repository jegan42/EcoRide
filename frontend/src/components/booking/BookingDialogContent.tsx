// frontend/src/components/booking/BookingDialogContent.tsx
import { DialogContent, Typography } from '@mui/material';
import { ReviewForm } from '../review/ReviewForm';
import type { JSX } from 'react';

type BookingAction = 'accept' | 'reject' | 'review' | 'no_show';

export const getDialogTitle = (action: BookingAction): string => {
  switch (action) {
    case 'accept':
      return 'Validation';
    case 'reject':
      return 'Annulation';
    case 'review':
      return 'Un avis';
    case 'no_show':
      return 'Non Présentation';
    default:
      return 'Action';
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
  if (action === 'no_show') {
    return (
      <DialogContent>
        <Typography variant="body2">
          {`Vous confirmez que la personne ne s'est pas présentée ?`}
        </Typography>
      </DialogContent>
    );
  }

  if (action !== 'accept' && action !== 'reject') return <></>;

  const label = action === 'accept' ? 'valider' : 'annuler';
  return (
    <DialogContent>
      <Typography variant="body2">
        {`Voulez-vous ${label} ce voyage ?`}
      </Typography>
    </DialogContent>
  );
};
