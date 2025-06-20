// frontend/src/services/tripService.ts
import api from '../api/axios';
import { API_URL } from '../constants/api';
import type { ApiResponse } from '../types/api';
import type { Trip } from '../types/trip';
import { cleanPayload } from '../utils/cleanPayload';
import { handleApiResponseSafe } from '../utils/handleApiResponse';

const fetchTrips = async (
  filters?: Partial<{
    departureCity: string;
    arrivalCity: string;
    departureDate: string;
    flexible: boolean;
  }>
): Promise<ApiResponse<Trip[]>> => {
  const body: Partial<{
    departureCity: string;
    arrivalCity: string;
    departureDate: string;
    flexible: boolean;
  }> = {};
  if (filters?.departureCity) body.departureCity = filters.departureCity;
  if (filters?.arrivalCity) body.arrivalCity = filters.arrivalCity;
  if (filters?.departureDate) body.departureDate = filters.departureDate;
  if (filters?.flexible) body.flexible = filters.flexible;

  const response = await api.post(
    `${API_URL}/trips/search`,
    cleanPayload(body),
    {
      withCredentials: true,
    }
  );
  return handleApiResponseSafe<Trip[]>(response.data);
};

const fetchAllTrips = async (): Promise<ApiResponse<Trip[]>> => {
  const response = await api.get(`${API_URL}/trips/all`);
  return handleApiResponseSafe<Trip[]>(response.data);
};

const fetchTripById = async (id: string): Promise<ApiResponse<Trip>> => {
  const response = await api.get(`${API_URL}/trips/${id}`, {
    withCredentials: true,
  });
  return handleApiResponseSafe<Trip>(response.data);
};

const fetchTripsByDriver = async (): Promise<ApiResponse<Trip[]>> => {
  const response = await api.get(`${API_URL}/trips/driver`, {
    withCredentials: true,
  });
  return handleApiResponseSafe<Trip[]>(response.data);
};

const createTrip = async (
  tripData: Partial<Trip>
): Promise<ApiResponse<Trip>> => {
  const response = await api.post(`${API_URL}/trips`, cleanPayload(tripData), {
    withCredentials: true,
  });
  return handleApiResponseSafe<Trip>(response.data);
};

const updateTrip = async (
  id: string,
  tripData: Partial<Trip>
): Promise<ApiResponse<Trip>> => {
  const response = await api.put(
    `${API_URL}/trips/${id}`,
    cleanPayload(tripData),
    {
      withCredentials: true,
    }
  );
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
  fetchAllTrips,
  fetchTripById,
  fetchTripsByDriver,
  createTrip,
  updateTrip,
  cancelTrip,
};
