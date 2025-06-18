// frontend/src/component/booking/BookingFilters.tsx
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import type { Booking } from '../../types/booking';

interface Props {
  bookings: Partial<Booking>[];
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  resetFilters: () => void;
}

export const BookingFilters: React.FC<Props> = ({
  bookings,
  statusFilter,
  setStatusFilter,
  resetFilters,
}) => {
  const safeBookings = bookings.filter(Boolean);
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
        <InputLabel id="booking-status-label" sx={{ fontSize: '0.85rem' }}>
          Statut
        </InputLabel>
        <Select
          labelId="booking-status-label"
          id="booking-status-select"
          value={statusFilter}
          label="Statut"
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ fontSize: '0.85rem' }}
        >
          <MenuItem value="">Tous</MenuItem>
          {[...new Set(safeBookings.map((t) => t.status))].filter(Boolean).map(
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
        aria-label="Réinitialiser les filtres"
        onClick={resetFilters}
        color="primary"
      >
        <RestoreIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};
