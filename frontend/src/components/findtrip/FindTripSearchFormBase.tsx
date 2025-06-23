// components/findtrip/FindTripSearchFormBase.tsx
import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  colors,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale/fr';

interface Props {
  departureCity: string;
  arrivalCity: string;
  date: Date | null;
  flexible: boolean;
  setDepartureCity: (v: string) => void;
  setArrivalCity: (v: string) => void;
  setDate: (v: Date | null) => void;
  setFlexible: (v: boolean) => void;
  onSearch: () => void;
  onReset?: () => void;
  availableDepartureCities: string[];
  availableArrivalCities: string[];
}

export const FindTripSearchFormBase: React.FC<Props> = ({
  departureCity,
  arrivalCity,
  date,
  flexible,
  setDepartureCity,
  setArrivalCity,
  setDate,
  setFlexible,
  onSearch,
  onReset,
  availableDepartureCities,
  availableArrivalCities,
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
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
                    },
                  },
                }}
                disablePast
              />
            </LocalizationProvider>
            <FormControlLabel
              label="Date flexible"
              control={
                <Checkbox
                  checked={flexible}
                  onChange={(e) => setFlexible(e.target.checked)}
                />
              }
              sx={{
                backgroundColor: colors.grey[100],
                border: `1px solid #BDBDBD`,
                borderRadius: 1,
                pl: 1.5,
                pr: 1.5,
                py: 1.25,
              }}
            />
          </Box>
          <Box sx={{ width: 240 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Départ</InputLabel>
              <Select
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                label="Départ"
              >
                <MenuItem value="">Toutes</MenuItem>
                {availableDepartureCities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Arrivée</InputLabel>
              <Select
                value={arrivalCity}
                onChange={(e) => setArrivalCity(e.target.value)}
                label="Arrivée"
              >
                <MenuItem value="">Toutes</MenuItem>
                {availableArrivalCities.map((city) => (
                  <MenuItem key={city} value={city}>
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
            flexWrap: 'wrap',
            gap: 2,
            mt: 2,
          }}
        >
          {onReset && (
            <Button variant="outlined" onClick={onReset} sx={{ maxWidth: 240 }}>
              Reset
            </Button>
          )}
          <Button variant="contained" onClick={onSearch} sx={{ maxWidth: 240 }}>
            Rechercher
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
