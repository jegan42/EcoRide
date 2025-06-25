// frontend/src/types/common.ts
export interface ApiError {
  message: string;
  statusCode?: number;
}

export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface ChartDataType {
  label: string;
  count: number;
}
