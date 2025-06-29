// frontend/src/hooks/useAverageRating.ts
import { useEffect, useState } from 'react';
import { useProfile } from './useProfile';
import type { AverageRating } from '../types/user';
import type { Trip } from '../types/trip';
import reviewsService from '../services/reviewsService';

export const useAverageRating = (
  trips?: Trip[],
  driverId?: string
): {
  averageRating: AverageRating;
  enrichedTrips: Trip[];
} => {
  const { user } = useProfile();
  const [averageRating, setAverageRating] = useState<AverageRating>({});
  const [enrichedTrips, setEnrichedTrips] = useState<Trip[]>([]);

  const idToFetch = driverId ?? user?.id;

  useEffect(() => {
    if (!idToFetch) return;
    const fetchRatings = async (): Promise<void> => {
      const data =
        await reviewsService.getAverageRatingsByTargetUser(idToFetch);
      setAverageRating(data);
    };

    void fetchRatings();
  }, [idToFetch]);

  useEffect(() => {
    if (!trips || trips.length === 0) return;

    const enrichTrips = async (): Promise<void> => {
      const driverIds = Array.from(
        new Set(trips.map((t) => t.driver?.id).filter(Boolean))
      );
      const ratingsMap = new Map<string, AverageRating>();

      await Promise.all(
        driverIds.map(async (id) => {
          const rating = await reviewsService.getAverageRatingsByTargetUser(
            id!
          );
          ratingsMap.set(id!, rating);
        })
      );

      const tripsWithRatings = trips.map((trip) => {
        const id = trip.driver?.id;
        if (!id) return trip;

        const rating = ratingsMap.get(id);
        return {
          ...trip,
          driver: {
            ...trip.driver,
            id: id,
            averageRating: rating,
          },
        } as Trip;
      });
      setEnrichedTrips((prev) => {
        const hasChanged =
          prev.length !== tripsWithRatings.length ||
          prev.some(
            (t, i) => JSON.stringify(t) !== JSON.stringify(tripsWithRatings[i])
          );

        return hasChanged ? tripsWithRatings : prev;
      });
    };

    void enrichTrips();
  }, [trips]);

  return { averageRating, enrichedTrips };
};
