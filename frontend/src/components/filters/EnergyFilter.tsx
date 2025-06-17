// frontend/src/component/filters/EnergyFilter.tsx
import React from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

interface EnergyFilterProps {
  ecoFilter: string;
  setEcoFilter: (value: string) => void;
  ecoCounts: Record<string, number>;
}

const options = [
  { value: '', label: 'Tous' },
  { value: 'notEco', label: 'Pas écologique' },
  { value: 'mediumEco', label: 'Semi écologique' },
  { value: 'eco', label: 'Écologique' },
];

export const EnergyFilter: React.FC<EnergyFilterProps> = ({
  ecoFilter,
  setEcoFilter,
  ecoCounts,
}) => {
  const getCount = (value: string): number =>
    value
      ? (ecoCounts[value] ?? 0)
      : Object.values(ecoCounts).reduce((sum, count) => sum + count, 0);
  return (
    <FormControl component="fieldset" sx={{ minWidth: 160 }}>
      <FormLabel
        component="legend"
        sx={(theme) => ({
          fontSize: '0.85rem',
          '&.Mui-focused': {
            color: theme.palette.primary.contrastText,
          },
        })}
      >
        Type d’énergie
      </FormLabel>

      <RadioGroup
        value={ecoFilter}
        onChange={(e) => setEcoFilter(e.target.value)}
        sx={{ fontSize: '0.85rem' }}
        name="eco-filter"
      >
        {options.map(({ value, label }) => (
          <FormControlLabel
            key={value}
            value={value}
            control={
              <Radio
                size="small"
                sx={(theme) => ({
                  color: theme.palette.primary.light,
                  '&.Mui-checked': {
                    color: theme.palette.primary.main,
                  },
                })}
              />
            }
            label={
              <Typography fontSize="0.85rem">
                {label} ({getCount(value)})
              </Typography>
            }
            sx={{ mt: 0.25 }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
