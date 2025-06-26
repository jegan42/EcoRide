// frontend/src/pages/FindTripPage.tsx
import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTrip } from '../hooks/useTrip';
import { Sidebar } from '../components/sidebar/Sidebar';
import { FindTripCard } from '../components/findtrip/FindTripCard';
import type { Trip } from '../types/trip';
import { FindTripSearch } from '../components/findtrip/FindTripSearch';
import { useFindTripFilters } from '../hooks/useFindTripFilters';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FindTripDialogContent } from '../components/findtrip/FindTripDialogContent';
import { ConfirmDialog } from '../components/dailog/ConfirmDialog';
import { useBookingsDialog } from '../hooks/useBookingsDialog';
import { useAverageRating } from '../hooks/useAverageRating';
import { FindTripSidebarContent } from '../components/findtrip/FindTripSidebarContent';

export const FindTripPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const initialDepartureCity = searchParams.get('departureCity') || '';
  const initialArrivalCity = searchParams.get('arrivalCity') || '';
  const initialDate = searchParams.get('departureDate')
    ? new Date(searchParams.get('departureDate')!)
    : null;
  const initialFlexible = searchParams.get('flexible') === 'true';

  useEffect(() => {
    const hasQuery = searchParams.toString() !== '';
    if (hasQuery) {
      void fetchTrips({
        departureCity: initialDepartureCity,
        arrivalCity: initialArrivalCity,
        departureDate: initialDate?.toISOString(),
        flexible: initialFlexible,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const navigate = useNavigate();

  const { allTrips, fetchTrips } = useTrip();

  const safeTrips = allTrips.filter(
    (v): v is Trip =>
      !!v?.id && new Date(v.departureDate).getTime() > new Date().getTime()
  );

  const { enrichedTrips } = useAverageRating(safeTrips);

  const {
    filteredTrips,
    departureCities,
    arrivalCities,
    ecoFilter,
    ecoCounts,
    priceRange,
    durationRange,
    selectedSeats,
    seatCounts,
    starFilter,
    sortKey,
    sortOrder,
    setEcoFilter,
    setPriceRange,
    setDurationRange,
    setSelectedSeats,
    setStarFilter,
    setSortKey,
    setSortOrder,
    resetFilters,
  } = useFindTripFilters(enrichedTrips);

  const {
    dialogTrip,
    submitting,
    handleCloseBooking,
    handleConfirm,
    seats,
    setSeats,
    handleOpenBooking,
  } = useBookingsDialog(() => fetchTrips({}));

  console.log(filteredTrips);
  return (
    <Sidebar
      sidebarContent={
        <FindTripSidebarContent
          sortKey={sortKey}
          sortOrder={sortOrder}
          setSortKey={setSortKey}
          setSortOrder={setSortOrder}
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
      }
    >
      <Box
        component="main"
        role="main"
        sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h4" fontWeight={600}>
            Trouver un trajet
          </Typography>
        </Box>
        <Box
          sx={{
            mx: 'auto',
          }}
        >
          <FindTripSearch
            fetchTrips={fetchTrips}
            availableDepartureCities={departureCities}
            availableArrivalCities={arrivalCities}
            initialValues={{
              departureCity: initialDepartureCity,
              arrivalCity: initialArrivalCity,
              date: initialDate,
              flexible: initialFlexible,
            }}
          />
        </Box>
        <Box
          sx={{
            mt: { xs: 10, md: 4 },
          }}
        >
          <Typography variant="h6">
            {filteredTrips.length} trajet
            {filteredTrips.length !== 1 ? 's' : ''} trouvé
          </Typography>
          {filteredTrips.length === 0 && allTrips.length > 0 ? (
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
              {filteredTrips.map((trip: Trip) => (
                <Box key={trip.id}>
                  <FindTripCard
                    trip={trip}
                    onDetails={() => navigate(`/tripdetails/${trip.id}`)}
                    onBook={() => handleOpenBooking(trip)}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
      {dialogTrip && (
        <ConfirmDialog
          title={'Réserver un trajet'}
          open={!!dialogTrip}
          submitting={submitting}
          onClose={handleCloseBooking}
          onConfirm={() => handleConfirm(dialogTrip)}
        >
          <FindTripDialogContent
            trip={dialogTrip}
            maxSeats={dialogTrip.availableSeats || 1}
            seats={seats}
            setSeats={setSeats}
          />
        </ConfirmDialog>
      )}
    </Sidebar>
  );
};
