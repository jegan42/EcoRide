// frontend/src/component/findtrip/TripInfoRow.tsx
import React from 'react';
import { Stack, Typography } from '@mui/material';

interface TripInfoRowProps {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  valueIsFallback?: boolean;
  fallback?: React.ReactNode;
}

export const TripInfoRow: React.FC<TripInfoRowProps> = ({
  icon,
  label,
  value,
  valueIsFallback = false,
  fallback = '–',
}) => {
  const displayValue =
    valueIsFallback && (value === undefined || value === null || value === '')
      ? fallback
      : value;

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" spacing={0.5} alignItems="center">
        {icon}
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{ textTransform: 'capitalize' }}
        >
          {label}
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
        {displayValue}
      </Typography>
    </Stack>
  );
};
