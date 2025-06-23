// frontend/src/types/review.ts

import type { FirestoreTimestamp } from './common';

export interface Review {
  id?: string;
  authorId: string;
  targetId: string;
  driverId: string;
  tripId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}
