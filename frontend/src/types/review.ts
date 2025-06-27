// frontend/src/types/review.ts

import type { FirestoreTimestamp } from './common';

export type ReviewStatusEnum = 'pending' | 'validate' | 'refused';

export interface Review {
  id?: string;
  authorId: string;
  targetId: string;
  driverId: string;
  tripId: string;
  bookingId: string;
  rating: number;
  comment: string;
  status: ReviewStatusEnum;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}
