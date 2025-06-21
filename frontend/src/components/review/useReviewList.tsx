import { useState, useEffect } from 'react';
import type { Review } from '../../types/review';
import {
  getReviewsByAuthor,
  getReviewsByTarget,
} from '../../services/reviewsService';

export const useReviewList = (
  userId?: string
): {
  allReviewsReceived: Review[];
  reviewReceivedPassenger: Review[];
  reviewReceivedDriver: Review[];
  allReviewsGiven: Review[];
  reviewGivenPassenger: Review[];
  reviewGivenDriver: Review[];
} => {
  const [allReviewsReceived, setAllReviewsReceived] = useState<Review[]>([]);
  const [allReviewsGiven, setAllReviewsGiven] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async (): Promise<void> => {
      if (!userId) return;
      const { data: received } = await getReviewsByTarget(userId);
      setAllReviewsReceived(received ?? []);

      const { data: given } = await getReviewsByAuthor(userId);
      setAllReviewsGiven(given ?? []);
    };

    void fetchReviews();
  }, [userId]);

  const reviewReceivedPassenger = allReviewsReceived.filter(
    (r) => r.targetId === userId && r.driverId !== userId
  );

  const reviewReceivedDriver = allReviewsReceived.filter(
    (r) => r.targetId === userId && r.driverId === userId
  );

  const reviewGivenPassenger = allReviewsGiven.filter(
    (r) => r.authorId === userId && r.targetId !== r.driverId
  );

  const reviewGivenDriver = allReviewsGiven.filter(
    (r) => r.authorId === userId && r.targetId === r.driverId
  );

  return {
    allReviewsReceived,
    reviewReceivedPassenger,
    reviewReceivedDriver,
    allReviewsGiven,
    reviewGivenPassenger,
    reviewGivenDriver,
  };
};
