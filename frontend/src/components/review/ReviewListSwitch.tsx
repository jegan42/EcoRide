// frontend/src/components/booking/ReviewListSwitch.tsx
import { Box, Typography } from '@mui/material';
import { useMemo, useState, type JSX } from 'react';
import { useProfile } from '../../hooks/useProfile';
import type { Review } from '../../types/review';
import { useReviewList } from './useReviewList';
import { SwitchButton } from '../switchbutton/SwitchButton';
import { ReviewList } from './ReviewList';

export const ReviewListSwitch = (): JSX.Element => {
  const { user, isDriver } = useProfile();
  const [isReceived, setIsReceived] = useState(false);
  const [isPassenger, setIsPassenger] = useState(false);

  const {
    reviewReceivedPassenger,
    reviewReceivedDriver,
    reviewGivenPassenger,
    reviewGivenDriver,
  } = useReviewList(user?.id);

  const reviewsToShow = useMemo((): Review[] => {
    if (isReceived && isPassenger) return reviewReceivedPassenger;
    if (isReceived && !isPassenger) return reviewReceivedDriver;
    if (!isReceived && isPassenger) return reviewGivenPassenger;
    if (!isReceived && !isPassenger) return reviewGivenDriver;
    return [];
  }, [
    isReceived,
    isPassenger,
    reviewReceivedPassenger,
    reviewReceivedDriver,
    reviewGivenPassenger,
    reviewGivenDriver,
  ]);

  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Box display={'flex'} justifyContent={'space-between'} my={2}>
        <SwitchButton
          checked={isReceived}
          onChange={setIsReceived}
          switchOn="Avis reçu"
          switchOff="Avis donné"
        />
        {isDriver && (
          <SwitchButton
            checked={isPassenger}
            onChange={setIsPassenger}
            switchOn="Passager"
            switchOff="Chauffeur"
            labelPlacement="start"
          />
        )}
      </Box>
      {!reviewsToShow.length ? (
        <Typography variant="body1" color="text.secondary">
          Aucun avis disponible.
        </Typography>
      ) : (
        <ReviewList reviews={reviewsToShow} />
      )}
    </Box>
  );
};
