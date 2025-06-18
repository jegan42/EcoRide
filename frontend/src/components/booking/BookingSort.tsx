// frontend/src/component/booking/BookingSort.tsx
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ArrowCircleUp, ArrowCircleDown } from '@mui/icons-material';

interface Props {
  sortKey: string;
  sortOrder: 'asc' | 'desc';
  setSortKey: (value: string) => void;
  setSortOrder: (value: 'asc' | 'desc') => void;
}

export const BookingSort: React.FC<Props> = ({
  sortKey,
  sortOrder,
  setSortKey,
  setSortOrder,
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
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="sort-label" sx={{ fontSize: '0.85rem' }}>
          Trier par
        </InputLabel>
        <Select
          labelId="sort-label"
          value={sortKey}
          label="Trier par"
          onChange={(e) => setSortKey(e.target.value)}
          sx={{ fontSize: '0.85rem' }}
        >
          <MenuItem value="departureDate">Date de départ</MenuItem>
          <MenuItem value="totalPrice">Prix total</MenuItem>
          <MenuItem value="addedAt">Date de réservation</MenuItem>
        </Select>
      </FormControl>

      <Tooltip
        title={sortOrder === 'asc' ? 'Ordre croissant' : 'Ordre décroissant'}
      >
        <IconButton
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          color="primary"
          aria-label={`Trier en ordre ${sortOrder === 'asc' ? 'décroissant' : 'croissant'}`}
        >
          {sortOrder === 'asc' ? (
            <ArrowCircleUp fontSize="large" />
          ) : (
            <ArrowCircleDown fontSize="large" />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};
