// frontend/src/component/vehicle/VehicleFilters.tsx
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { type Vehicle } from '../../types/vehicle';

interface Props {
  filteredVehicles: Vehicle[];
  energyFilter: string;
  seatFilter: string | number;
  setEnergyFilter: (value: string) => void;
  setSeatFilter: (value: number | string) => void;
  resetfilters: () => void;
}

export const VehicleFilters: React.FC<Props> = ({
  filteredVehicles,
  energyFilter,
  seatFilter,
  setEnergyFilter,
  setSeatFilter,
  resetfilters,
}) => {
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
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel sx={{ fontSize: '0.85rem' }}>Énergie</InputLabel>
        <Select
          value={energyFilter}
          label="Énergie"
          onChange={(e) => setEnergyFilter(e.target.value)}
          sx={{ fontSize: '0.85rem' }}
        >
          <MenuItem value="">Toutes</MenuItem>
          {[...new Set(filteredVehicles.map((v) => v?.energy))].map(
            (energy) =>
              energy && (
                <MenuItem key={energy} value={energy}>
                  {energy}
                </MenuItem>
              )
          )}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel sx={{ fontSize: '0.85rem' }}>Places</InputLabel>
        <Select
          value={seatFilter}
          label="Places"
          onChange={(e) => setSeatFilter(Number(e.target.value))}
          sx={{ fontSize: '0.85rem' }}
        >
          <MenuItem value="">Toutes</MenuItem>
          {[...new Set(filteredVehicles.map((v) => v?.seatCount))]
            .filter((v): v is number => typeof v === 'number')
            .sort((a, b) => a - b)
            .map((count) => (
              <MenuItem key={count} value={count}>
                {count}
              </MenuItem>
            ))}
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
