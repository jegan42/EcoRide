// frontend/src/component/filters/StarRatingProps.tsx
import React from 'react';
import { Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface StarRatingProps {
  value: number;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  size = 'small',
  color = '#FFD700',
}) => {
  const clampedValue = Math.max(0, Math.min(value, 5));
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (clampedValue >= i) {
      stars.push(<StarIcon key={`star-${i}`} fontSize={size} sx={{ color }} />);
    } else if (clampedValue >= i - 0.5) {
      stars.push(
        <StarHalfIcon key={`half-${i}`} fontSize={size} sx={{ color }} />
      );
    } else {
      stars.push(
        <StarBorderIcon key={`empty-${i}`} fontSize={size} sx={{ color }} />
      );
    }
  }

  return <Box display="flex">{stars}</Box>;
};
