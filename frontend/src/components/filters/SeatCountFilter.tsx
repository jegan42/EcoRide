// frontend/src/component/filters/SeatCountFilter.tsx
import React from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Typography,
} from '@mui/material';

interface CountFilterProps {
  selected: number[];
  setSelected: (values: number[]) => void;
  counts: Record<number, number>;
}

export const SeatCountFilter: React.FC<CountFilterProps> = ({
  selected,
  setSelected,
  counts,
}) => {
  const groupedCounts = { ...counts };
  const FIVE_OR_MORE = 5;
  let fivePlusTotal = 0;

  for (const [key, value] of Object.entries(counts)) {
    const num = Number(key);
    if (num >= FIVE_OR_MORE) {
      fivePlusTotal += value;
      delete groupedCounts[num];
    }
  }

  const handleChange = (count: number): void => {
    if (selected.includes(count)) {
      setSelected(selected.filter((n) => n !== count));
    } else {
      setSelected([...selected, count]);
    }
  };

  return (
    <FormControl component="fieldset" sx={{ mt: 2 }}>
      <FormLabel
        component="legend"
        sx={(theme) => ({
          fontSize: '0.85rem',
          '&.Mui-focused': {
            color: theme.palette.primary.contrastText,
          },
        })}
      >
        Places disponibles
      </FormLabel>

      <FormGroup>
        {[1, 2, 3, 4].map((count) => (
          <FormControlLabel
            key={count}
            control={
              <Checkbox
                checked={selected.includes(count)}
                onChange={() => handleChange(count)}
                sx={(theme) => ({
                  fontSize: '0.85rem',
                  color: theme.palette.primary.light,
                })}
              />
            }
            label={
              <Typography fontSize="0.85rem">
                {count} place{count > 1 ? 's' : ''} ({groupedCounts[count] ?? 0}
                )
              </Typography>
            }
          />
        ))}

        <FormControlLabel
          control={
            <Checkbox
              checked={selected.includes(FIVE_OR_MORE)}
              onChange={() => handleChange(FIVE_OR_MORE)}
              sx={(theme) => ({
                fontSize: '0.85rem',
                color: theme.palette.primary.light,
              })}
            />
          }
          label={
            <Typography fontSize="0.85rem">
              5 places et plus ({fivePlusTotal})
            </Typography>
          }
        />
      </FormGroup>
    </FormControl>
  );
};
