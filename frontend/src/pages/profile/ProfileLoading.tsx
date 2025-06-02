// frontend/src/pages/profile/ProfileLoading.tsx
import React from 'react';
import { Typography, Box, Stack, Skeleton } from '@mui/material';

const ProfileLoading: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Skeleton
        variant="circular"
        width={100}
        height={100}
        sx={{ mb: 2 }}
        data-testid="skeleton-avatar"
      />

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        <Skeleton width="60%" data-testid="skeleton-username" />
      </Typography>

      <Stack spacing={1} width="100%" mt={2}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton
            key={idx}
            width="100%"
            height={24}
            data-testid="skeleton-info"
          />
        ))}
      </Stack>
    </Box>
  );
};

export default ProfileLoading;
