// frontend/src/components/profile/ReviewList.tsx
import { Box, Stack } from '@mui/material';
import type { Review, ReviewStatusEnum } from '../../types/review';
import { ReviewCard } from './ReviewCard';
import theme from '../../styles/theme';
import type { AdminFormMode } from '../../types/admin';
import { useAdmin } from '../../hooks/useAdmin';

interface Props {
  reviews?: Review[];
  setViewMode?: (mode: AdminFormMode) => void;
  setSelectedData?: (data: Review) => void;
}

export const ReviewList: React.FC<Props> = ({
  reviews,
  setViewMode,
  setSelectedData,
}) => {
  const { allReviews } = useAdmin();
  const dataToUse = reviews ?? allReviews;
  const setSx =
    dataToUse.length > 2
      ? {
          border: `1px solid ${theme.palette.primary.main}`,
          borderRadius: 1,
          backgroundColor: 'background.paper',
        }
      : {};

  const borderLeft = (
    status: ReviewStatusEnum
  ):
    | {
        borderLeft: string;
      }
    | undefined => {
    if (status === 'pending')
      return { borderLeft: `5px solid ${theme.palette.warning.main}` };
    if (status === 'validate')
      return { borderLeft: `5px solid ${theme.palette.primary.main}` };
    if (status === 'refused')
      return { borderLeft: `5px solid ${theme.palette.error.main}` };
  };
  return (
    <Stack spacing={1}>
      {dataToUse.map((review) => (
        <Box key={review.id} sx={{ ...setSx, ...borderLeft(review.status) }}>
          <ReviewCard
            review={review}
            setViewMode={setViewMode}
            setSelectedData={setSelectedData}
          />
        </Box>
      ))}
    </Stack>
  );
};
