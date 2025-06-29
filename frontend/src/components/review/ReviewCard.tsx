// frontend/src/component/profile/ReviewCard.tsx
import {
  Avatar,
  Chip,
  IconButton,
  Rating,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import type { Review } from '../../types/review';
import { useReviewAuthor } from '../../hooks/useReviewAuthor';
import { formatTimestampToDate } from '../../utils/formatDateTime';
import type { AdminFormMode } from '../../types/admin';
import { useAppSelector } from '../../hooks/useAppSelector';
import { hasRole } from '../../utils/hasRole';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface Props {
  review?: Review;
  setViewMode?: (mode: AdminFormMode) => void;
  setSelectedData?: (data: Review) => void;
}

export const ReviewCard: React.FC<Props> = ({
  review,
  setViewMode,
  setSelectedData,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const isAuthorized = user
    ? hasRole(user, 'admin') || hasRole(user, 'employee')
    : false;
  const { author } = useReviewAuthor(review?.authorId);

  const comment = review?.comment ?? '';
  const isTruncated = comment.length > 50;
  const displayComment =
    isTruncated && !isAuthorized ? comment.slice(0, 40) + '...' : comment;

  let label = 'Refusé';
  if (review?.status === 'pending') {
    label = 'En attente';
  } else if (review?.status === 'validate') {
    label = 'Validé';
  }

  let colorChip: 'warning' | 'success' | 'error' = 'error';
  if (review?.status === 'pending') {
    colorChip = 'warning';
  } else if (review?.status === 'validate') {
    colorChip = 'success';
  }
  return (
    <Stack direction={'row'} spacing={2} m={1}>
      <Stack flexDirection={'column'} spacing={2}>
        {author ? (
          <Avatar
            src={author.avatar ?? undefined}
            sx={{ width: 35, height: 35, mb: 2 }}
          />
        ) : (
          <Skeleton variant="circular" width={35} height={35} />
        )}
        <Chip label={label} color={colorChip} size="small" />
      </Stack>
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
        <Typography variant="body2" fontSize={'0.75rem'}>
          {review?.status}
        </Typography>
      </Stack>

      {setViewMode && setSelectedData && review?.status === 'pending' && (
        <Stack
          direction={'column'}
          alignItems="center"
          justifyContent={'space-between'}
          width={{ xs: '100%', sm: '10%' }}
        >
          <Tooltip title={'Valider l’avis'}>
            <IconButton
              aria-label="validate review"
              onClick={() => {
                setViewMode('reviewEdit');
                setSelectedData(review as Review);
              }}
              sx={(theme) => ({ color: theme.palette.primary.main })}
            >
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={'Refuser l’avis'}>
            <IconButton
              aria-label="refused review"
              onClick={() => {
                setViewMode('reviewDelete');
                setSelectedData(review as Review);
              }}
              sx={(theme) => ({ color: theme.palette.error.main })}
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </Stack>
  );
};
