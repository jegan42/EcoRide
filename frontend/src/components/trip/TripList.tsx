// frontend/src/component/trip/TripList.tsx
import { Box, Button, Typography } from '@mui/material';
import type { DashboardMode } from '../../hooks/useDashboardState';
import { TripInfo } from './TripInfo';
import type { Trip } from '../../types/trip';
import { useTrip } from '../../hooks/useTrip';
import { useFilterTrip } from '../../hooks/useFilterTrip';
import { TripFilters } from './TripFilters';
import { TripSort } from './TripSort';

interface Props {
  setDashboardMode: (mode: DashboardMode) => void;
  setSelectedData: (data: Trip | null) => void;
}

const AddTripButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <Button
    variant="contained"
    sx={{
      mt: 3,
      fontSize: { xs: '0.85rem', md: '1rem' },
      whiteSpace: 'nowrap',
      alignSelf: { xs: 'stretch', sm: 'center' },
    }}
    onClick={onClick}
  >
    Ajouter un voyage
  </Button>
);

export const TripList: React.FC<Props> = ({
  setDashboardMode,
  setSelectedData,
}) => {
  const { error, trips, onCancelTrip } = useTrip();

  const safeTrips = trips.filter((v): v is Trip => !!v?.id);

  const {
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
  } = useFilterTrip(safeTrips);

  const message =
    error ?? 'Aucun voyage ne correspond aux filtres sélectionnés.';

  if (!filteredTrips?.length || error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          mt: 2,
        }}
      >
        <Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
          {message}
        </Typography>

        <AddTripButton onClick={() => setDashboardMode('tripAdd')} />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mt: 3,
        }}
      >
        <TripFilters
          trips={filteredTrips}
          vehicleFilter={vehicleFilter}
          energyFilter={energyFilter}
          departureFilter={departureFilter}
          arrivalFilter={arrivalFilter}
          statusFilter={statusFilter}
          setVehicleFilter={setVehicleFilter}
          setEnergyFilter={setEnergyFilter}
          setDepartureFilter={setDepartureFilter}
          setArrivalFilter={setArrivalFilter}
          setStatusFilter={setStatusFilter}
          resetfilters={resetfilters}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          gap: 2,
          mt: 3,
        }}
      >
        <TripSort
          sortKey={sortKey}
          sortOrder={sortOrder}
          setSortKey={setSortKey}
          setSortOrder={setSortOrder}
        />

        <AddTripButton onClick={() => setDashboardMode('tripAdd')} />
      </Box>
      {filteredTrips.map((trip) => {
        const { vehicle: _vehicle, driver: _driver, ...tripData } = trip;
        return (
          <TripInfo
            key={trip?.id}
            trip={trip}
            onEdit={() => {
              setDashboardMode('tripEdit');
              setSelectedData(tripData);
            }}
            onStart={() => {
              setDashboardMode('tripStart');
              setSelectedData(tripData);
            }}
            onArrived={() => {
              setDashboardMode('tripArrived');
              setSelectedData(tripData);
            }}
            onDelete={(id) => onCancelTrip(id)}
          />
        );
      })}
    </>
  );
};
