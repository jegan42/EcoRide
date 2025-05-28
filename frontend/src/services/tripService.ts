// src/services/tripService.ts
import axios from 'axios';
import type { Trip } from '../types/trip';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const fetchTrips = async (
  filters?: Partial<{
    departureCity: string;
    arrivalCity: string;
    date: string;
    flexible: boolean;
  }>
): Promise<Trip[]> => {
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

  const response = await axios.get(`${API_URL}/trips`, {
    withCredentials: true,
    params,
  });
  return response.data;
};

const fetchTripById = async (id: string): Promise<Trip> => {
  const response = await axios.get(`${API_URL}/trips/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

const createTrip = async (tripData: Partial<Trip>): Promise<Trip> => {
  const response = await axios.post(`${API_URL}/trips`, tripData, {
    withCredentials: true,
  });
  return response.data;
};

const updateTrip = async (
  id: string,
  tripData: Partial<Trip>
): Promise<Trip> => {
  const response = await axios.put(`${API_URL}/trips/${id}`, tripData, {
    withCredentials: true,
  });
  return response.data;
};

const cancelTrip = async (id: string): Promise<Trip> => {
  const response = await axios.delete(`${API_URL}/trips/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export default {
  fetchTrips,
  fetchTripById,
  createTrip,
  updateTrip,
  cancelTrip,
};
