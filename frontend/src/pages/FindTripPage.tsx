// frontend/src/pages/FindTripPage.tsx
import React, { type JSX } from 'react';
import { Box, Typography } from '@mui/material';
import { useTrip } from '../hooks/useTrip';
import { Sidebar } from '../components/sidebar/Sidebar';
import { FindTripCard } from '../components/findtrip/FindTripCard';
import type { Trip } from '../types/trip';
import type { User } from '../types/user';
import type { Vehicle } from '../types/vehicle';
import { FindTripSearch } from '../components/findtrip/FindTripSearch';
import { FindTripFilters } from '../components/findtrip/FindTripFilters';
import { FindTripSort } from '../components/findtrip/FindTripSort';
import { useFindTripFilters } from '../hooks/useFindTripFilters';
import { useNavigate } from 'react-router-dom';

export const FindTripPage: React.FC = () => {
  const { allTrips, fetchTrips } = useTrip();
  const navigate = useNavigate();

  const safeTrips = allTrips.filter((v): v is Trip => !!v?.id);

  const {
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
  } = useFindTripFilters(safeTrips);

  const SidebarContent = (): JSX.Element => (
    <Box
      aria-label="Filtres de recherche"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
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
        selectedSeats={selectedSeats}
        seatCounts={seatCounts}
        starFilter={starFilter}
        setEcoFilter={setEcoFilter}
        setPriceRange={setPriceRange}
        setSelectedSeats={setSelectedSeats}
        setStarFilter={setStarFilter}
        resetFilters={resetFilters}
      />
    </Box>
  );

  return (
    <Sidebar sidebarContent={<SidebarContent />}>
      <Box
        component="main"
        role="main"
        sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}
        aria-label="main Box"
      >
        <Box
          sx={{ display: 'flex', justifyContent: 'center' }}
          aria-label="main Box1"
        >
          <Typography variant="h4" fontWeight={600}>
            Trouver un trajet
          </Typography>
        </Box>
        <Box
          sx={{
            mx: 'auto',
          }}
          aria-label="main BoxBB"
        >
          <FindTripSearch
            fetchTrips={fetchTrips}
            availableDepartureCities={departureCities}
            availableArrivalCities={arrivalCities}
          />
        </Box>
        <Box
          sx={{
            mt: { xs: 10, md: 4 },
          }}
        >
          <Typography variant="h6">
            {filteredTrips.length} trajet{filteredTrips.length !== 1 ? 's' : ''}{' '}
            trouvé
          </Typography>
          {filteredTrips.length === 0 ? (
            <Typography variant="body1">
              Aucun trajet ne correspond à vos critères.
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                minWidth: '260px',
                gap: 2,
              }}
            >
              {filteredTrips.map(
                (
                  trip: Partial<Trip> & {
                    vehicle?: Partial<Vehicle>;
                    driver?: Partial<User>;
                  }
                ) => (
                  <FindTripCard
                    key={trip.id}
                    trip={trip}
                    onDetails={() => navigate(`/tripdetails/${trip.id}`)}
                  />
                )
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Sidebar>
  );
};
