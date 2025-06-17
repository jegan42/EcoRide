// frontend/src/component/filters/SliderInput.tsx
import React, { useState } from 'react';
import { Box, FormLabel, Slider, TextField, type Theme } from '@mui/material';

interface SliderInputProps {
  title: string;
  Range: [number, number];
  setRange: (range: [number, number]) => void;
  min?: number;
  max?: number;
}

const textFieldStyles = (theme: Theme): Record<string, unknown> => ({
  width: '45%',
  '& .MuiInputBase-root': {
    fontSize: '0.85rem',
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 1,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.primary.contrastText,
  },
  '& .Mui-focused': {
    color: theme.palette.primary.contrastText,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.dark,
  },
});

export const SliderInput: React.FC<SliderInputProps> = ({
  title,
  Range,
  setRange,
  min = 0,
  max = 100,
}) => {
  const [focused, setFocused] = useState(false);
  const handleSliderChange = (_: Event, newValue: number | number[]): void => {
    const [newMin, newMax] = newValue as [number, number];
    if (newMin <= newMax) {
      setRange([newMin, newMax]);
    }
  };

  const handleInputChange = (
    index: 0 | 1,
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = Number(event.target.value);
    const newRange: [number, number] = [...Range] as [number, number];
    newRange[index] = isNaN(value) ? 0 : value;

    if (newRange[0] <= newRange[1]) {
      setRange(newRange);
    }
  };

  return (
    <Box sx={{ width: 220, mt: 2 }}>
      <FormLabel
        component="legend"
        sx={(theme) => ({
          fontSize: '0.85rem',
          color: focused
            ? theme.palette.primary.contrastText
            : theme.palette.secondary.main,
        })}
      >
        {title}
      </FormLabel>

      <Box onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
        <Slider
          value={Range}
          onChange={handleSliderChange}
          min={min}
          max={max}
          step={1}
          valueLabelDisplay="auto"
          getAriaLabel={() => `${title} range`}
          getAriaValueText={(value) => `${value} €`}
          sx={{ mt: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <TextField
            label="Min"
            type="number"
            size="small"
            value={Range[0]}
            onChange={(e) =>
              handleInputChange(0, e as React.ChangeEvent<HTMLInputElement>)
            }
            slotProps={{
              input: {
                inputProps: { min, max: Range[1] },
              },
            }}
            sx={(theme) => textFieldStyles(theme)}
          />
          <TextField
            label="Max"
            type="number"
            size="small"
            value={Range[1]}
            onChange={(e) =>
              handleInputChange(1, e as React.ChangeEvent<HTMLInputElement>)
            }
            slotProps={{
              input: {
                inputProps: { min: Range[0], max },
              },
            }}
            sx={(theme) => textFieldStyles(theme)}
          />
        </Box>
      </Box>
    </Box>
  );
};
