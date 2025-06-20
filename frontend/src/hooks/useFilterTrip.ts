// frontend/src/hooks/useFilterTrip.ts
import { useMemo, useState } from 'react';
import type { Trip } from '../types/trip';

export const useFilterTrip = (
  trips: Trip[]
): {
  filteredTrips: Trip[];
  vehicleFilter: string;
  energyFilter: string;
  departureFilter: string;
  arrivalFilter: string;
  statusFilter: string;
  sortKey: string;
  sortOrder: 'asc' | 'desc';
  setVehicleFilter: React.Dispatch<React.SetStateAction<string>>;
  setEnergyFilter: React.Dispatch<React.SetStateAction<string>>;
  setDepartureFilter: React.Dispatch<React.SetStateAction<string>>;
  setArrivalFilter: React.Dispatch<React.SetStateAction<string>>;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  setSortKey: React.Dispatch<React.SetStateAction<string>>;
  setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
  resetfilters: () => void;
} => {
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [energyFilter, setEnergyFilter] = useState('');
  const [departureFilter, setDepartureFilter] = useState('');
  const [arrivalFilter, setArrivalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortKey, setSortKey] = useState('addedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const resetfilters = (): void => {
    setVehicleFilter('');
    setEnergyFilter('');
    setDepartureFilter('');
    setArrivalFilter('');
    setStatusFilter('');
    setSortKey('addedAt');
    setSortOrder('desc');
  };

  const filteredTrips = useMemo(() => {
    let result = [...trips].filter(Boolean);

    const getSortValue = (trip: Trip): number => {
      switch (sortKey) {
        case 'addedAt':
          return trip.createdAt ? new Date(trip.createdAt).getTime() : 0;
        case 'updatedAt':
          return trip.updatedAt ? new Date(trip.updatedAt).getTime() : 0;
        case 'departureDate':
          return trip.departureDate
            ? new Date(trip.departureDate).getTime()
            : 0;
        case 'price':
          return Number(trip.price);
        case 'availableSeats':
          return Number(trip.availableSeats);
        default:
          return 0;
      }
    };

    if (vehicleFilter) {
      result = result.filter((t) => t.vehicle?.brand === vehicleFilter);
    }

    if (energyFilter) {
      result = result.filter((t) => t.vehicle?.energy === energyFilter);
    }

    if (departureFilter) {
      result = result.filter((t) => t.departureCity === departureFilter);
    }

    if (arrivalFilter) {
      result = result.filter((t) => t.arrivalCity === arrivalFilter);
    }

    if (statusFilter) {
      result = result.filter((t) => t.status === statusFilter);
    }

    result.sort((a, b) => {
      const aVal = getSortValue(a);
      const bVal = getSortValue(b);

      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [
    trips,
    vehicleFilter,
    energyFilter,
    departureFilter,
    arrivalFilter,
    statusFilter,
    sortKey,
    sortOrder,
  ]);

  return {
    filteredTrips,
    vehicleFilter,
    energyFilter,
    departureFilter,
    arrivalFilter,
    statusFilter,
    sortKey,
    sortOrder,
    setVehicleFilter,
    setEnergyFilter,
    setDepartureFilter,
    setArrivalFilter,
    setStatusFilter,
    setSortKey,
    setSortOrder,
    resetfilters,
  };
};
