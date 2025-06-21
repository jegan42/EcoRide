// frontend/src/hooks/useFindTripFilters.ts
import { useMemo, useState } from 'react';
import type { Trip } from '../types/trip';
import { fuelEcoGroups } from '../types/vehicle';

export const useFindTripFilters = (
  trips: Trip[]
): {
  filteredTrips: Trip[];
  departureCities: string[];
  arrivalCities: string[];
  ecoFilter: string;
  ecoCounts: Record<number, number>;
  priceRange: [number, number];
  selectedSeats: number[];
  seatCounts: Record<number, number>;
  starFilter: number;
  sortKey: string;
  sortOrder: 'asc' | 'desc';
  setEcoFilter: React.Dispatch<React.SetStateAction<string>>;
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  setSelectedSeats: React.Dispatch<React.SetStateAction<number[]>>;
  setStarFilter: React.Dispatch<React.SetStateAction<number>>;
  setSortKey: React.Dispatch<React.SetStateAction<string>>;
  setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
  resetFilters: () => void;
} => {
  const [sortKey, setSortKey] = useState('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [ecoFilter, setEcoFilter] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [starFilter, setStarFilter] = useState(0);

  const resetFilters = (): void => {
    setSortKey('rating');
    setSortOrder('desc');
    setEcoFilter('');
    setPriceRange([0, 100]);
    setSelectedSeats([]);
    setStarFilter(0);
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
        case 'rating':
          return Number(trip.driver?.averageRating?.asDriver?.rating);
        default:
          return 0;
      }
    };

    if (ecoFilter) {
      const allowedEnergies =
        fuelEcoGroups[ecoFilter as keyof typeof fuelEcoGroups];
      result = result.filter((t) =>
        allowedEnergies.includes(t.vehicle?.energy || '')
      );
    }

    if (priceRange) {
      const [min, max] = priceRange;
      result = result.filter((t) => {
        const price = Number(t.price);
        return price >= min && price <= max;
      });
    }

    if (selectedSeats.length > 0) {
      result = result.filter((t) => {
        const seat = Number(t.availableSeats);
        return selectedSeats.some((s) => (s === 5 ? seat >= 5 : seat === s));
      });
    }

    if (starFilter > 0) {
      result = result.filter(
        (t) => (t.driver?.averageRating?.asDriver?.rating ?? 0) >= starFilter
      );
    }

    result.sort((a, b) => {
      const aVal = getSortValue(a);
      const bVal = getSortValue(b);

      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [
    trips,
    ecoFilter,
    priceRange,
    selectedSeats,
    starFilter,
    sortKey,
    sortOrder,
  ]);

  const seatCounts = filteredTrips.reduce(
    (acc, trip) => {
      const seats = Number(trip.availableSeats);
      acc[seats] = (acc[seats] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  const ecoCounts = filteredTrips.reduce(
    (acc, trip) => {
      const energy = trip.vehicle?.energy;
      if (energy) {
        const ecoKey =
          Object.entries(fuelEcoGroups).find(([_, values]) =>
            values.includes(energy)
          )?.[0] ?? 'notEco';

        acc[ecoKey] = (acc[ecoKey] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const departureCities = Array.from(
    new Set(
      filteredTrips
        .map((t) => t.departureCity)
        .filter((city): city is string => Boolean(city))
    )
  );
  const arrivalCities = Array.from(
    new Set(
      filteredTrips
        .map((t) => t.arrivalCity)
        .filter((city): city is string => Boolean(city))
    )
  );

  return {
    filteredTrips,
    departureCities,
    arrivalCities,
    ecoFilter,
    ecoCounts,
    priceRange,
    selectedSeats,
    seatCounts,
    starFilter,
    sortKey,
    sortOrder,
    setEcoFilter,
    setPriceRange,
    setSelectedSeats,
    setStarFilter,
    setSortKey,
    setSortOrder,
    resetFilters,
  };
};
