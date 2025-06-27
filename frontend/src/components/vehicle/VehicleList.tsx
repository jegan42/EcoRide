// frontend/src/component/vehicle/VehicleList.tsx
import { Box, Button, Typography } from '@mui/material';
import { type Vehicle } from '../../types/vehicle';
import { useVehicle } from '../../hooks/useVehicle';
import type { DashboardMode } from '../../hooks/useDashboardState';
import { VehicleCard } from './VehicleCard';
import { useFilterVehicle } from '../../hooks/useFilterVehicle';
import { VehicleFilters } from './VehicleFilters';
import { VehicleSort } from './VehicleSort';

interface Props {
  setDashboardMode: (mode: DashboardMode) => void;
  setSelectedData: (data: Vehicle | null) => void;
}

export const VehicleList: React.FC<Props> = ({
  setDashboardMode,
  setSelectedData,
}) => {
  const { error, vehicles, onDeleteVehicle } = useVehicle();

  const vehiclesToSet = (vehicles ?? []).filter(
    (v): v is Vehicle => v !== undefined
  );

  const {
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
  } = useFilterVehicle(vehiclesToSet);

  const filteredVehiclesToSet = filteredVehicles.filter(
    (v): v is Vehicle => v !== undefined
  );

  return (
    <>
      {error && (
        <Typography variant="body1" color="text.secondary">
          {error}
        </Typography>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mt: 3,
        }}
      >
        <VehicleFilters
          filteredVehicles={filteredVehiclesToSet}
          energyFilter={energyFilter}
          seatFilter={seatFilter}
          setEnergyFilter={setEnergyFilter}
          setSeatFilter={setSeatFilter}
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
        <VehicleSort
          sortKey={sortKey}
          sortOrder={sortOrder}
          setSortKey={setSortKey}
          setSortOrder={setSortOrder}
        />
        <Button
          variant="contained"
          sx={{
            fontSize: '0.85rem',
            whiteSpace: 'nowrap',
            alignSelf: { xs: 'stretch', sm: 'center' },
          }}
          onClick={() => setDashboardMode('vehicleAdd')}
        >
          Ajouter un véhicule
        </Button>
      </Box>

      {filteredVehiclesToSet.length > 0 ? (
        filteredVehiclesToSet.map((vehicle) => {
          return (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={() => {
                setDashboardMode('vehicleEdit');
                setSelectedData(vehicle);
              }}
              onDelete={(id) => onDeleteVehicle({ id })}
            />
          );
        })
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
          Aucun véhicule ne correspond aux filtres.
        </Typography>
      )}
    </>
  );
};
