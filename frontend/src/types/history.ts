// frontend/src/types/history.ts
export type RoleEnum = 'passenger' | 'driver' | 'admin' | 'employee';
export type HistoryStatusEnum = 'completed' | 'no_show' | 'canceled';

export interface History {
  id: string;
  userId: string;
  tripId: string;
  role: RoleEnum;
  status: HistoryStatusEnum;
  tripDate: string;
  createdAt: string;
  updatedAt: string;
}
