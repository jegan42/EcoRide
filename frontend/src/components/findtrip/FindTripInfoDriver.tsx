// frontend/src/component/findtrip/FindTripInfoDriver.tsx
import { Avatar, Stack, Typography } from '@mui/material';
import type { User } from '../../types/user';
import { formatField } from '../../utils/formatField';
import StarIcon from '@mui/icons-material/Star';
import { useAverageRating } from '../../hooks/useAverageRating';
import { ReviewBox } from '../review/ReviewBox';

interface Props {
  driver?: User;
  allInfo?: boolean;
}

export const FindTripInfoDriver: React.FC<Props> = ({
  driver,
  allInfo = false,
}) => {
  const { averageRating } = useAverageRating(undefined, driver?.id);

  const avatarSize = allInfo ? 150 : 50;
  const stackDirection = allInfo ? 'row' : 'column';

  return (
    <Stack
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        gap: 2,
      }}
    >
      <Avatar
        src={driver?.avatar ?? undefined}
        sx={{ width: avatarSize, height: avatarSize }}
      />
      <Stack
        direction="column"
        spacing={1}
        alignItems="flex-end"
        sx={{ width: { xs: '100%', sm: '50%' } }}
      >
        <Stack direction={stackDirection} spacing={2} alignItems="flex-end">
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={(theme) => ({
              textTransform: 'uppercase',
              color: theme.palette.primary.dark,
            })}
          >
            {formatField(driver?.username)}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="body2">
              {formatField(Number(averageRating?.asDriver?.rating).toFixed(1))}(
              {formatField(averageRating?.asDriver?.reviewCount)})
            </Typography>
            <StarIcon
              fontSize="small"
              sx={(theme) => ({ color: theme.palette.warning.main })}
            />
          </Stack>
        </Stack>
        {allInfo && (
          <Stack width={'100%'}>
            <ReviewBox
              driverId={driver?.id}
              reviewCount={averageRating?.asDriver?.reviewCount}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
