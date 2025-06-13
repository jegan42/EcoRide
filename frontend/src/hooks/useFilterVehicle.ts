// frontend/src/hooks/useFilterVehicle.ts
import { useMemo, useState } from 'react';
import type { Vehicle } from '../types/vehicle';

export const useFilterVehicle = (
  vehicles: Vehicle[]
): {
  filteredVehicles: Partial<Vehicle[]>;
  energyFilter: string;
  seatFilter: number | string;
  sortKey: string;
  sortOrder: 'asc' | 'desc';
  setEnergyFilter: (energy: string) => void;
  setSeatFilter: (seat: string | number) => void;
  setSortKey: (sort: string) => void;
  setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
  resetfilters: () => void;
} => {
  const [energyFilter, setEnergyFilter] = useState<string>('');
  const [seatFilter, setSeatFilter] = useState<number | string>('');
  const [sortKey, setSortKey] = useState<string>('addedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const resetfilters = (): void => {
    setEnergyFilter('');
    setSeatFilter('');
    setSortKey('addedAt');
    setSortOrder('desc');
  };

  const filteredVehicles = useMemo(() => {
    let list = [...vehicles].filter(Boolean);

    if (energyFilter) {
      list = list.filter((v) => v?.energy === energyFilter);
    }

    if (seatFilter !== '') {
      list = list.filter((v) => v?.seatCount === seatFilter);
    }

    list.sort((a, b) => {
      let result = 0;

      switch (sortKey) {
        case 'addedAt':
          result =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          result =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'year':
          result = a.vehicleYear - b.vehicleYear;
          break;
        case 'seatCount':
          result = a.seatCount - b.seatCount;
          break;
      }

      return sortOrder === 'asc' ? result : -result;
    });

    return list;
  }, [vehicles, energyFilter, seatFilter, sortKey, sortOrder]);

  return {
    filteredVehicles,
    energyFilter,
    seatFilter,
    sortKey,
    sortOrder,
    setEnergyFilter,
    setSeatFilter,
    setSortKey,
    setSortOrder,
    resetfilters,
  };
};
