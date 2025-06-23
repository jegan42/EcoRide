// frontend/src/components/findtrip/FindTripSearch.tsx
import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  colors,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale/fr';
import { useFindTripSearch } from '../../hooks/useFindTripSearch';
import { useNavigate } from 'react-router-dom';

interface Props {
  fetchTrips: (
    data: Partial<{
      departureCity: string;
      arrivalCity: string;
      departureDate: string;
      flexible: boolean;
    }>
  ) => Promise<boolean>;
  availableDepartureCities: string[];
  availableArrivalCities: string[];
  isHome?: boolean;
  initialValues?: {
    departureCity?: string;
    arrivalCity?: string;
    date?: Date | null;
    flexible?: boolean;
  };
}

const textFieldSx = {
  backgroundColor: colors.grey[100],
  borderRadius: 1,
  '& .MuiInputBase-root': {
    backgroundColor: colors.grey[100],
  },
};

export const FindTripSearch: React.FC<Props> = ({
  fetchTrips,
  availableDepartureCities,
  availableArrivalCities,
  isHome = false,
  initialValues = {},
}) => {
  const navigate = useNavigate();
  const {
    departureCity,
    arrivalCity,
    date,
    flexible,
    setDepartureCity,
    setArrivalCity,
    setDate,
    setFlexible,
    handleSearch: originalHandleSearch,
    handleReset,
  } = useFindTripSearch(fetchTrips, initialValues);

  const handleSearch = async (): Promise<void> => {
    if (isHome) {
      const searchParams = new URLSearchParams();
      if (departureCity) searchParams.set('departureCity', departureCity);
      if (arrivalCity) searchParams.set('arrivalCity', arrivalCity);
      if (date) searchParams.set('departureDate', date.toISOString());
      if (flexible) searchParams.set('flexible', 'true');

      void navigate(`/findtrip?${searchParams.toString()}`);
    } else {
      await originalHandleSearch();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2.25,
              maxWidth: 240,
            }}
          >
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={fr}
            >
              <DatePicker
                label="Date"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                    sx: {
                      backgroundColor: colors.grey[100],
                      borderRadius: 1,
                      '& .MuiInputBase-root': {
                        backgroundColor: colors.grey[100],
                      },
                    },
                  },
                }}
                disablePast
              />
            </LocalizationProvider>
            <FormControlLabel
              label="Date flexible"
              aria-label="Activer ou désactiver la flexibilité de la date"
              labelPlacement="start"
              control={
                <Checkbox
                  checked={flexible}
                  onChange={(e) => setFlexible(e.target.checked)}
                  sx={(theme) => ({
                    color: theme.palette.primary.main,
                    '&.Mui-checked': { color: theme.palette.primary.dark },
                    p: 0.5,
                  })}
                />
              }
              sx={(theme) => ({
                backgroundColor: colors.grey[100],
                border: `1px solid #BDBDBD`,
                borderRadius: 1,
                m: 0,
                color: theme.palette.secondary.main,
                width: '100%',
                pl: 1.5,
                pr: 1.5,
                py: 1.25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                '& .MuiTypography-root': {
                  fontSize: '0.875rem',
                },
              })}
            />
          </Box>
          <Box sx={{ width: 240 }}>
            <FormControl fullWidth margin="normal" sx={textFieldSx}>
              <InputLabel>Départ disponible</InputLabel>
              <Select
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                label="Départ disponible"
                sx={{ textTransform: 'capitalize' }}
              >
                <MenuItem value="">Toutes</MenuItem>
                {availableDepartureCities.map((city) => (
                  <MenuItem
                    key={city}
                    value={city}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" sx={textFieldSx}>
              <InputLabel>Arrivée disponible</InputLabel>
              <Select
                value={arrivalCity}
                onChange={(e) => setArrivalCity(e.target.value)}
                label="Arrivée disponible"
                sx={{ textTransform: 'capitalize' }}
              >
                <MenuItem value="">Toutes</MenuItem>
                {availableArrivalCities.map((city) => (
                  <MenuItem
                    key={city}
                    value={city}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            maxHeight: 64,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {!isHome && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleReset}
              sx={{ mt: 2, maxWidth: 240 }}
              fullWidth
            >
              Reset recherche
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ mt: 2, maxWidth: 240 }}
            fullWidth
          >
            Rechercher
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
