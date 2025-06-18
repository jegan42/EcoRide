// frontend/src/hooks/useBookings.ts
import { useEffect, useState } from 'react';
import bookingService from '../services/bookingService';
import type { Booking } from '../types/booking';
import { enqueueSnackbarError } from '../utils/enqueueSnackbar';

export const useBookings = (): {
  bookings: Booking[];
  driverBookings: Booking[];
  loading: boolean;
  refetch: () => Promise<void>;
  refetchDriver: () => Promise<void>;
  refetchAll: () => Promise<void>;
} => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [driverBookings, setDriverBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async (): Promise<void> => {
    try {
      const { data } = await bookingService.fetchBookings();
      if (data) setBookings(data);
    } catch (error) {
      enqueueSnackbarError(error);
    }
  };

  const fetchBookingsByDriver = async (): Promise<void> => {
    try {
      const { data } = await bookingService.fetchBookingsByDriver();
      if (data) setDriverBookings(data);
    } catch (error) {
      enqueueSnackbarError(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    void Promise.all([fetchBookings(), fetchBookingsByDriver()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const refetchAll = async (): Promise<void> => {
    setLoading(true);
    try {
      await Promise.all([fetchBookings(), fetchBookingsByDriver()]);
    } catch (error) {
      enqueueSnackbarError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    driverBookings,
    loading,
    refetch: fetchBookings,
    refetchDriver: fetchBookingsByDriver,
    refetchAll,
  };
};
