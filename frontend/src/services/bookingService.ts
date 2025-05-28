// src/services/bookingService.ts
import axios from 'axios';
import type { Booking } from '../types/booking';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const createBooking = async (
  bookingData: Partial<Booking>
): Promise<Booking> => {
  const response = await axios.post(`${API_URL}/bookings`, bookingData, {
    withCredentials: true,
  });
  return response.data;
};

const cancelBooking = async (id: string): Promise<Booking> => {
  const response = await axios.delete(`${API_URL}/bookings/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

const fetchBookings = async (): Promise<Booking[]> => {
  const response = await axios.get(`${API_URL}/bookings/me`, {
    withCredentials: true,
  });
  return response.data;
};

const fetchBookingsByDriver = async (): Promise<Booking[]> => {
  const response = await axios.get(`${API_URL}/bookings/driver`, {
    withCredentials: true,
  });
  return response.data;
};

const fetchBookingsByTrip = async (id: string): Promise<Booking[]> => {
  const response = await axios.get(`${API_URL}/bookings/trip/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

const validateBooking = async (id: string): Promise<Booking[]> => {
  const response = await axios.post(`${API_URL}/bookings/${id}/validate`, {
    withCredentials: true,
  });
  return response.data;
};

const fetchBookingById = async (id: string): Promise<Booking> => {
  const response = await axios.get(`${API_URL}/bookings/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export default {
  createBooking,
  cancelBooking,
  fetchBookings,
  fetchBookingsByDriver,
  fetchBookingsByTrip,
  validateBooking,
  fetchBookingById,
};
