// frontend/src/component/vehicle/VehicleSort.tsx
import { Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { IconButton, Tooltip } from '@mui/material';
import { ArrowCircleUp, ArrowCircleDown } from '@mui/icons-material';

interface Props {
  sortKey: string;
  sortOrder: 'asc' | 'desc';
  setSortKey: (value: string) => void;
  setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
}

export const VehicleSort: React.FC<Props> = ({
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
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel sx={{ fontSize: '0.85rem' }}>Trier par</InputLabel>
            <Select
              value={sortKey}
              label="Trier par"
              onChange={(e) => setSortKey(e.target.value)}
              sx={{ fontSize: '0.85rem' }}
            >
              <MenuItem value="addedAt">Date d’ajout</MenuItem>
              <MenuItem value="updatedAt">Date de modification</MenuItem>
              <MenuItem value="year">Année</MenuItem>
              <MenuItem value="seatCount">Places</MenuItem>
            </Select>
          </FormControl>

          <Tooltip
            title={
              sortOrder === 'asc' ? 'Ordre croissant' : 'Ordre décroissant'
            }
          >
            <IconButton
              onClick={() =>
                setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
              }
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
      </Box>
    </>
  );
};
