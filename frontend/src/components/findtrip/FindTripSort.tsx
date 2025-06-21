// frontend/src/components/findtrip/FindTripSort.tsx
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { ArrowCircleUp, ArrowCircleDown } from '@mui/icons-material';

interface Props {
  sortKey: string;
  sortOrder: 'asc' | 'desc';
  setSortKey: (value: string) => void;
  setSortOrder: (value: 'asc' | 'desc') => void;
}

const sortOptions = [
  { value: 'addedAt', label: 'Date d’ajout' },
  { value: 'updatedAt', label: 'Date de modification' },
  { value: 'departureDate', label: 'Date de départ' },
  { value: 'rating', label: 'Note' },
  { value: 'price', label: 'Prix' },
  { value: 'availableSeats', label: 'Places disponibles' },
];

export const FindTripSort: React.FC<Props> = ({
  sortKey,
  sortOrder,
  setSortKey,
  setSortOrder,
}) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ my: 2 }}>
          Tri
        </Typography>
        <Tooltip
          title={sortOrder === 'asc' ? 'Ordre croissant' : 'Ordre décroissant'}
        >
          <IconButton
            aria-label={
              sortOrder === 'asc'
                ? 'Trier en ordre croissant'
                : 'Trier en ordre décroissant'
            }
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            sx={(theme) => ({ color: `${theme.palette.primary.light}` })}
          >
            {sortOrder === 'asc' ? (
              <ArrowCircleUp fontSize="large" />
            ) : (
              <ArrowCircleDown fontSize="large" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel
            id="sort-key-label"
            sx={(theme) => ({
              fontSize: '0.85rem',
              color: theme.palette.primary.contrastText,
              '&.Mui-focused': {
                color: theme.palette.primary.contrastText,
              },
            })}
          >
            Trier par
          </InputLabel>
          <Select
            value={sortKey}
            label="Trier par"
            labelId="sort-key-label"
            onChange={(e) => setSortKey(e.target.value)}
            sx={(theme) => ({
              fontSize: '0.85rem',
              color: theme.palette.primary.contrastText,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              },
            })}
          >
            {sortOptions.map((opt) => (
              <MenuItem
                key={opt.value}
                value={opt.value}
                sx={{ fontSize: '0.85rem', color: 'inherit' }}
              >
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </>
  );
};
