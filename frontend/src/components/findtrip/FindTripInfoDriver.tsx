// frontend/src/component/findtrip/FindTripInfoDriver.tsx
import { Avatar, Stack, Typography } from '@mui/material';
import type { User } from '../../types/user';
import { formatField } from '../../utils/formatField';
import StarIcon from '@mui/icons-material/Star';
import { ProfileCard } from '../profile/ProfileCard';

interface Props {
  driver?: Partial<User>;
  allInfo?: boolean;
}

export const FindTripInfoDriver: React.FC<Props> = ({
  driver,
  allInfo = false,
}) => {
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
      }}
    >
      <Avatar
        src={driver?.avatar ?? undefined}
        sx={{ width: avatarSize, height: avatarSize }}
      />
      <Stack direction="column" spacing={0.5} alignItems="flex-end">
        <Stack direction={stackDirection} spacing={0.5} alignItems="flex-end">
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
            <Typography variant="body2">{formatField(undefined)}</Typography>
            <StarIcon
              fontSize="small"
              sx={(theme) => ({ color: theme.palette.warning.main })}
            />
          </Stack>
        </Stack>
        {allInfo && (
          <>
            <ProfileCard user={driver} />
          </>
        )}
      </Stack>
    </Stack>
  );
};
