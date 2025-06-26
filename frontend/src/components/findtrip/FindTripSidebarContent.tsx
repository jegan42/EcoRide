// frontend/src/components/findtrip/FindTripSidebarContent.tsx
import React from 'react';
import { Box } from '@mui/material';
import { FindTripFilters } from './FindTripFilters';
import { FindTripSort } from './FindTripSort';

interface Props {
  sortKey: string;
  sortOrder: 'asc' | 'desc';
  setSortKey: (key: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  ecoFilter: string;
  ecoCounts: Record<string, number>;
  priceRange: [number, number];
  durationRange: [number, number];
  selectedSeats: number[];
  seatCounts: Record<number, number>;
  starFilter: number;
  setEcoFilter: (value: string) => void;
  setPriceRange: (value: [number, number]) => void;
  setDurationRange: (value: [number, number]) => void;
  setSelectedSeats: (value: number[]) => void;
  setStarFilter: (value: number) => void;
  resetFilters: () => void;
}

export const FindTripSidebarContent: React.FC<Props> = ({
  sortKey,
  sortOrder,
  setSortKey,
  setSortOrder,
  ecoFilter,
  ecoCounts,
  priceRange,
  durationRange,
  selectedSeats,
  seatCounts,
  starFilter,
  setEcoFilter,
  setPriceRange,
  setDurationRange,
  setSelectedSeats,
  setStarFilter,
  resetFilters,
}) => (
  <Box
    aria-label="Filtres de recherche"
    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
  >
    <FindTripSort
      sortKey={sortKey}
      sortOrder={sortOrder}
      setSortKey={setSortKey}
      setSortOrder={setSortOrder}
    />
    <FindTripFilters
      ecoFilter={ecoFilter}
      ecoCounts={ecoCounts}
      priceRange={priceRange}
      durationRange={durationRange}
      selectedSeats={selectedSeats}
      seatCounts={seatCounts}
      starFilter={starFilter}
      setEcoFilter={setEcoFilter}
      setPriceRange={setPriceRange}
      setDurationRange={setDurationRange}
      setSelectedSeats={setSelectedSeats}
      setStarFilter={setStarFilter}
      resetFilters={resetFilters}
    />
  </Box>
);
