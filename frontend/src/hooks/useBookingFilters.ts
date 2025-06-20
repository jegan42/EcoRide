// frontend/src/hooks/useBookingFilters.ts
import { useMemo, useState } from 'react';
import type { Booking } from '../types/booking';

export const useBookingFilters = (
  bookings: Booking[]
): {
  filteredBookings: Booking[];
  statusFilter: string;
  sortKey: string;
  sortOrder: 'asc' | 'desc';
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  setSortKey: React.Dispatch<React.SetStateAction<string>>;
  setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
  resetFilters: () => void;
} => {
  const [statusFilter, setStatusFilter] = useState('');
  const [sortKey, setSortKey] = useState('addedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const resetFilters = (): void => {
    setStatusFilter('');
    setSortKey('addedAt');
    setSortOrder('desc');
  };

  const filteredBookings = useMemo(() => {
    let result = [...bookings].filter(Boolean);

    const getSortValue = (booking: Booking): number => {
      switch (sortKey) {
        case 'addedAt':
          return booking.createdAt ? new Date(booking.createdAt).getTime() : 0;
        case 'totalPrice':
          return Number(booking.totalPrice);
        case 'departureDate':
          return booking.trip?.departureDate
            ? new Date(booking.trip.departureDate).getTime()
            : 0;
        default:
          return 0;
      }
    };

    if (statusFilter) {
      result = result.filter((t) => t.status === statusFilter);
    }

    result.sort((a, b) => {
      const aVal = getSortValue(a);
      const bVal = getSortValue(b);

      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [bookings, statusFilter, sortKey, sortOrder]);

  return {
    filteredBookings,
    statusFilter,
    sortKey,
    sortOrder,
    setStatusFilter,
    setSortKey,
    setSortOrder,
    resetFilters,
  };
};
