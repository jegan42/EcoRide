// frontend/src/services/tripService.ts
import api from '../api/axios';
import { API_URL } from '../constants/api';
import type { ApiResponse } from '../types/api';
import type { Trip } from '../types/trip';
import { handleApiResponseSafe } from '../utils/handleApiResponse';

const fetchTrips = async (
  filters?: Partial<{
    departureCity: string;
    arrivalCity: string;
    date: string;
    flexible: boolean;
  }>
): Promise<ApiResponse<Trip[]>> => {
  const params: Partial<{
    departureCity: string;
    arrivalCity: string;
    date: string;
    flexible: boolean;
  }> = {};
  if (filters?.departureCity) params.departureCity = filters.departureCity;
  if (filters?.arrivalCity) params.arrivalCity = filters.arrivalCity;
  if (filters?.date) params.date = filters.date;
  if (filters?.flexible) params.flexible = filters.flexible;

  const response = await api.get(`${API_URL}/trips`, {
    withCredentials: true,
    params,
  });
  return handleApiResponseSafe<Trip[]>(response.data);
};

const fetchTripById = async (id: string): Promise<ApiResponse<Trip>> => {
  const response = await api.get(`${API_URL}/trips/${id}`, {
    withCredentials: true,
  });
  return handleApiResponseSafe<Trip>(response.data);
};

const createTrip = async (
  tripData: Partial<Trip>
): Promise<ApiResponse<Trip>> => {
  const response = await api.post(`${API_URL}/trips`, tripData, {
    withCredentials: true,
  });
  return handleApiResponseSafe<Trip>(response.data);
};

const updateTrip = async (
  id: string,
  tripData: Partial<Trip>
): Promise<ApiResponse<Trip>> => {
  const response = await api.put(`${API_URL}/trips/${id}`, tripData, {
    withCredentials: true,
  });
  return handleApiResponseSafe<Trip>(response.data);
};

const cancelTrip = async (id: string): Promise<ApiResponse<Trip>> => {
  const response = await api.delete(`${API_URL}/trips/${id}`, {
    withCredentials: true,
  });
  return handleApiResponseSafe<Trip>(response.data);
};

export default {
  fetchTrips,
  fetchTripById,
  createTrip,
  updateTrip,
  cancelTrip,
};
