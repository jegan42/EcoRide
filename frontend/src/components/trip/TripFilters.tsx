// frontend/src/component/trip/TripFilters.tsx
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import type { Trip } from '../../types/trip';

interface Props {
  trips: Trip[];
  vehicleFilter: string;
  energyFilter: string;
  departureFilter: string;
  arrivalFilter: string;
  statusFilter: string;
  setVehicleFilter: (value: string) => void;
  setEnergyFilter: (value: string) => void;
  setDepartureFilter: (value: string) => void;
  setArrivalFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  resetfilters: () => void;
}

export const TripFilters: React.FC<Props> = ({
  trips,
  vehicleFilter,
  energyFilter,
  departureFilter,
  arrivalFilter,
  statusFilter,
  setVehicleFilter,
  setEnergyFilter,
  setDepartureFilter,
  setArrivalFilter,
  setStatusFilter,
  resetfilters,
}) => {
  const safeTrips = trips.filter(Boolean);
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel sx={{ fontSize: '0.85rem' }}>Véhicule</InputLabel>
        <Select
          value={vehicleFilter}
          label="Véhicule"
          onChange={(e) => setVehicleFilter(e.target.value)}
          sx={{ fontSize: '0.85rem' }}
        >
          <MenuItem value="">Tous</MenuItem>
          {[...new Set(safeTrips.map((t) => t.vehicle?.brand))].map(
            (brand) =>
              brand && (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              )
          )}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel sx={{ fontSize: '0.85rem' }}>Énergie</InputLabel>
        <Select
          value={energyFilter}
          label="Énergie"
          onChange={(e) => setEnergyFilter(e.target.value)}
          sx={{ fontSize: '0.85rem' }}
        >
          <MenuItem value="">Tous</MenuItem>
          {[...new Set(safeTrips.map((t) => t.vehicle?.energy))].map(
            (energy) =>
              energy && (
                <MenuItem key={energy} value={energy}>
                  {energy}
                </MenuItem>
              )
          )}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel sx={{ fontSize: '0.85rem' }}>Départ</InputLabel>
        <Select
          value={departureFilter}
          label="Départ"
          onChange={(e) => setDepartureFilter(e.target.value)}
          sx={{ fontSize: '0.85rem' }}
        >
          <MenuItem value="">Tous</MenuItem>
          {[...new Set(safeTrips.map((t) => t.departureCity))].map(
            (loc) =>
              loc && (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              )
          )}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel sx={{ fontSize: '0.85rem' }}>Arrivée</InputLabel>
        <Select
          value={arrivalFilter}
          label="Arrivée"
          onChange={(e) => setArrivalFilter(e.target.value)}
          sx={{ fontSize: '0.85rem' }}
        >
          <MenuItem value="">Tous</MenuItem>
          {[...new Set(safeTrips.map((t) => t.arrivalCity))].map(
            (loc) =>
              loc && (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              )
          )}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel sx={{ fontSize: '0.85rem' }}>Statut</InputLabel>
        <Select
          value={statusFilter}
          label="Statut"
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ fontSize: '0.85rem' }}
        >
          <MenuItem value="">Tous</MenuItem>
          {[...new Set(safeTrips.map((t) => t.status))].map(
            (status) =>
              status && (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              )
          )}
        </Select>
      </FormControl>

      <IconButton
        onClick={resetfilters}
        sx={(theme) => ({ color: `${theme.palette.primary.main}` })}
      >
        <RestoreIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};
