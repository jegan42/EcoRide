// frontend/src/types/history.ts
import type { Booking } from './booking';
import type { FirestoreTimestamp } from './common';
import type { Trip } from './trip';
import type { RoleEnum } from './user';
export type HistoryStatusEnum = 'completed' | 'no_show' | 'cancelled';

export interface History {
  id?: string;
  userId: string;
  tripId: string;
  bookingId: string;
  cancellerId?: string;
  role: RoleEnum;
  status: HistoryStatusEnum;
  tripDate: FirestoreTimestamp;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
  trip?: Trip;
  booking?: Booking;
}

export const getStatusLabel = (status: HistoryStatusEnum): string => {
  switch (status) {
    case 'completed':
      return 'Terminé';
    case 'no_show':
      return 'Non présenté';
    case 'cancelled':
      return 'Annulé';
  }
};

export const getStatusColor = (
  status: HistoryStatusEnum
): 'success' | 'warning' | 'error' => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'no_show':
      return 'warning';
    case 'cancelled':
      return 'error';
  }
};
