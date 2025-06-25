// frontend/src/hooks/useReview.ts
import { useEffect, useState } from 'react';
import type { Review } from '../types/review';
import reviewsService from '../services/reviewsService';

export const useReview = (
  driverId?: string
): {
  reviews: Review[];
  loading: boolean;
  error: Error | null;
} => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async (): Promise<void> => {
      if (!driverId) return;
      setLoading(true);
      setError(null);
      try {
        const { data } = await reviewsService.getReviewsByTarget(driverId);
        if (isMounted) setReviews(data);
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setReviews([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [driverId]);

  return { reviews, loading, error };
};
