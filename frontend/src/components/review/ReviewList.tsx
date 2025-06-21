// frontend/src/components/profile/ReviewList.tsx
import { Box, Stack } from '@mui/material';
import type { Review } from '../../types/review';
import { ReviewCard } from './ReviewCard';
import theme from '../../styles/theme';

export const ReviewList: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  const setSx =
    reviews.length > 2
      ? {
          border: `1px solid ${theme.palette.primary.main}`,
          borderRadius: 1,
        }
      : {};
  return (
    <Stack spacing={1}>
      {reviews.map((review) => (
        <Box key={review.id} sx={setSx}>
          <ReviewCard review={review} />
        </Box>
      ))}
    </Stack>
  );
};
