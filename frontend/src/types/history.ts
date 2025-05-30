// frontend/src/types/history.ts
import type { RoleEnum } from './user';
export type HistoryStatusEnum = 'completed' | 'no_show' | 'cancelled';

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
