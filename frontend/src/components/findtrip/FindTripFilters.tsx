// frontend/src/component/findtrip/FindTripFilters.tsx
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { SliderInput } from '../filters/SliderInput';
import { SeatCountFilter } from '../filters/SeatCountFilter';
import { RatingFilter } from '../filters/RatingFilter';
import { EnergyFilter } from '../filters/EnergyFilter';

interface Props {
  ecoFilter: string;
  ecoCounts: Record<string, number>;
  priceRange: [number, number];
  durationRange: [number, number];
  selectedSeats: number[];
  seatCounts: Record<number, number>;
  starFilter: number;
  setEcoFilter: (value: string) => void;
  setPriceRange: (value: [number, number]) => void;
  setDurationRange: (value: [number, number]) => void;
  setSelectedSeats: (value: number[]) => void;
  setStarFilter: (value: number) => void;
  resetFilters: () => void;
}

export const FindTripFilters: React.FC<Props> = ({
  ecoFilter,
  ecoCounts,
  priceRange,
  durationRange,
  selectedSeats,
  seatCounts,
  starFilter,
  setEcoFilter,
  setPriceRange,
  setDurationRange,
  setSelectedSeats,
  setStarFilter,
  resetFilters,
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
          Filtre
        </Typography>
        <Tooltip title={'Réinitialiser les filtres'}>
          <IconButton
            aria-label="Réinitialiser les filtres"
            onClick={resetFilters}
            sx={(theme) => ({ color: `${theme.palette.primary.light}` })}
          >
            <RestoreIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <RatingFilter rating={starFilter} onChange={setStarFilter} />

        <EnergyFilter
          ecoFilter={ecoFilter}
          setEcoFilter={setEcoFilter}
          ecoCounts={ecoCounts}
        />

        <SeatCountFilter
          selected={selectedSeats}
          setSelected={setSelectedSeats}
          counts={seatCounts}
        />

        <SliderInput
          title="Durée (minutes)"
          Range={durationRange}
          setRange={setDurationRange}
          min={0}
          max={2000}
        />

        <SliderInput
          title="Prix (€)"
          Range={priceRange}
          setRange={setPriceRange}
          min={0}
          max={100}
        />
      </Box>
    </>
  );
};
