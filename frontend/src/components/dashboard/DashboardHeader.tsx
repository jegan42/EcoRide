// frontend/src/component/dashboard/DashboardHeader.tsx
import { Box, Avatar, Typography } from '@mui/material';
import theme from '../../styles/theme';
import { useProfile } from '../../hooks/useProfile';

export const DashboardHeader: React.FC = () => {
  const { user } = useProfile();
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
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ color: theme.palette.primary.main, textTransform: 'uppercase' }}
        gutterBottom
      >
        {user?.username}
      </Typography>
    </Box>
  );
};
