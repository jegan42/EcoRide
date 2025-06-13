// frontend/src/component/trip/TripSort.tsx
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

export const TripSort: React.FC<Props> = ({
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
        alignItems: 'center',
        gap: 2,
      }}
    >
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel sx={{ fontSize: '0.85rem' }}>Trier par</InputLabel>
        <Select
          value={sortKey}
          label="Trier par"
          onChange={(e) => setSortKey(e.target.value)}
          sx={{ fontSize: '0.85rem' }}
        >
          <MenuItem value="addedAt">Date d’ajout</MenuItem>
          <MenuItem value="updatedAt">Date de modification</MenuItem>
          <MenuItem value="departureDate">Date de départ</MenuItem>
          <MenuItem value="price">Prix</MenuItem>
          <MenuItem value="availableSeats">Places disponibles</MenuItem>
        </Select>
      </FormControl>

      <Tooltip
        title={sortOrder === 'asc' ? 'Ordre croissant' : 'Ordre décroissant'}
      >
        <IconButton
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          sx={(theme) => ({ color: `${theme.palette.primary.main}` })}
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
