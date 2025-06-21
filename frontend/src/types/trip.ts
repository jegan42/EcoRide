// frontend/src/types/trip.ts
import type { User } from './user';
import type { Vehicle } from './vehicle';

export type TripStatus = 'open' | 'full' | 'cancelled';

export interface Trip {
  id: string;
  driverId: string;
  vehicleId: string;
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  arrivalDate: string;
  availableSeats: number;
  price: number;
  status: TripStatus;
  createdAt: string;
  updatedAt: string;
  driver?: User;
  vehicle?: Vehicle;
}
