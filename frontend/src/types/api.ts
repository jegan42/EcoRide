// frontemd/src/types/api.ts
export interface ApiResponse<T> {
  message: string;
  data: T;
}
