// frontend/src/types/booking.ts
import type { Trip } from './trip';
import type { User } from './user';
import type { Vehicle } from './vehicle';

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
  user?: Partial<User>;
  trip?: Partial<Trip>;
}

export type BookingFull = Partial<Booking> & {
  user?: Partial<User>;
  trip?: Partial<Trip> & {
    driver?: Partial<User>;
    vehicle?: Partial<Vehicle>;
  };
};
