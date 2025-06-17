// frontend/src/component/filters/RatingFilter.tsx
import React, { useState, useRef } from 'react';
import { Box, FormLabel, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface RatingFilterProps {
  rating: number;
  onChange: (rating: number) => void;
}

export const RatingFilter: React.FC<RatingFilterProps> = ({
  rating,
  onChange,
}) => {
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <FormLabel
        component="legend"
        sx={(theme) => ({
          fontSize: '0.85rem',
          color: focused
            ? theme.palette.primary.contrastText
            : theme.palette.secondary.main,
          transition: 'color 0.2s ease',
        })}
      >
        Note
      </FormLabel>

      <Box
        ref={containerRef}
        display="flex"
        alignItems="center"
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          // ne perdre le focus que si on sort du conteneur
          if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            setFocused(false);
          }
        }}
        tabIndex={-1} // Permet le focus du conteneur si besoin
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <IconButton
            key={value}
            onClick={() => onChange(value)}
            sx={{
              color: value <= rating ? '#fbc02d' : 'gray',
            }}
          >
            {value <= rating ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
        ))}
      </Box>
    </Box>
  );
};
