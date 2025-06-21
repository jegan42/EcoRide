// frontend/src/component/profile/ReviewCard.tsx
import { Avatar, Rating, Skeleton, Stack, Typography } from '@mui/material';
import type { Review } from '../../types/review';
import { useReviewAuthor } from '../../hooks/useReviewAuthor';
import { formatTimestampToDate } from '../../utils/formatDateTime';

interface Props {
  review?: Review;
}

export const ReviewCard: React.FC<Props> = ({ review }) => {
  const { author } = useReviewAuthor(review?.authorId);

  const comment = review?.comment ?? '';
  const isTruncated = comment.length > 50;
  const displayComment = isTruncated ? comment.slice(0, 40) + '...' : comment;

  return (
    <Stack direction={'row'} spacing={2} m={1}>
      {author ? (
        <Avatar
          src={author.avatar ?? undefined}
          sx={{ width: 35, height: 35, mb: 2 }}
        />
      ) : (
        <Skeleton variant="circular" width={35} height={35} />
      )}
      <Stack direction={'column'} spacing={0.5} flexGrow={1}>
        <Stack
          direction={'row'}
          spacing={2}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Typography
            variant="subtitle2"
            fontWeight={700}
            textTransform={'uppercase'}
            fontSize={'0.85rem'}
          >
            {author?.username ?? 'Utilisateur'}
          </Typography>
          <Typography variant="body2" fontSize={'0.85rem'}>
            {formatTimestampToDate(review?.createdAt)}
          </Typography>
          <Rating
            name="read-only"
            value={review?.rating}
            precision={0.1}
            readOnly
            size="small"
          />
        </Stack>
        <Typography variant="body2" fontSize={'0.75rem'}>
          {displayComment}
        </Typography>
      </Stack>
    </Stack>
  );
};
