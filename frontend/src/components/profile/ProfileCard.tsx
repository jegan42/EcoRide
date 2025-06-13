// frontend/src/component/profile/ProfileCard.tsx
import { Avatar, Box, Paper, Stack, Typography } from '@mui/material';
import type { User } from '../../types/user';

interface Props {
  user?: Partial<User>;
}

export const ProfileCard: React.FC<Props> = ({ user }) => {
  return (
    <Paper
      elevation={3}
      sx={(theme) => ({
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: `2px solid ${theme.palette.primary.main}`,
        gap: 2,
      })}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Avatar
          src={user?.avatar ?? undefined}
          sx={{ width: 90, height: 90, mb: 2 }}
        />
        <Stack spacing={1}>
          <Typography variant="subtitle2" fontWeight={700}>
            {user?.username}
          </Typography>
          <Typography variant="body2">{user?.email}</Typography>
          <Typography variant="body2">{user?.phone}</Typography>
        </Stack>
      </Box>
    </Paper>
  );
};
