// frontend/src/component/dashboard/DashboardHeader.tsx
import { Box, Avatar, Typography, Stack } from '@mui/material';
import theme from '../../styles/theme';
import { useProfile } from '../../hooks/useProfile';
import { formatField } from '../../utils/formatField';
import StarIcon from '@mui/icons-material/Star';
import { useAverageRating } from '../../hooks/useAverageRating';

export const DashboardHeader: React.FC = () => {
  const { user } = useProfile();

  const { averageRating } = useAverageRating();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Avatar
        src={user?.avatar ?? undefined}
        sx={{ width: 100, height: 100, mb: 2 }}
      />
      <Stack>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: theme.palette.primary.main, textTransform: 'uppercase' }}
          gutterBottom
        >
          {user?.username}
        </Typography>
        {averageRating.asDriver !== undefined && (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="body2">
              Note conducteur({formatField(averageRating.asDriver.reviewCount)})
              : {formatField(averageRating.asDriver.rating)}
            </Typography>
            <StarIcon
              fontSize="small"
              sx={(theme) => ({ color: theme.palette.warning.main })}
            />
          </Stack>
        )}
        {averageRating.asPassenger !== undefined && (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="body2">
              Note passager({formatField(averageRating.asPassenger.reviewCount)}
              ) : {formatField(averageRating.asPassenger.rating)}
            </Typography>
            <StarIcon
              fontSize="small"
              sx={(theme) => ({ color: theme.palette.warning.main })}
            />
          </Stack>
        )}
      </Stack>
    </Box>
  );
};
