// frontend/src/types/review.ts

export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

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
