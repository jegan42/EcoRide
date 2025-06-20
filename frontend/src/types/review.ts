// frontend/src/types/review.ts
export interface Review {
  id?: string;
  authorId: string;
  targetId: string;
  tripId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}
