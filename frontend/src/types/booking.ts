// frontend/src/types/booking.ts
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  cancellerId?: string;
  tripId: string;
  status: BookingStatus;
  totalPrice: number;
  seatCount: number;
  createdAt: string;
  updatedAt: string;
}
