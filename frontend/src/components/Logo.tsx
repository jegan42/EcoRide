// frontend/src/components/Logo.tsx
import { Box, Stack, Typography } from '@mui/material';
import type { JSX } from 'react';
import ecorideLogo from '../assets/ecoride_logo.png';

interface Props {
  isFooter?: boolean;
}

export const Logo: React.FC<Props> = ({ isFooter = false }): JSX.Element => {
  return (
    <Stack
      direction={isFooter ? 'column-reverse' : 'row'}
      alignItems="center"
      spacing={0.5}
      sx={{
        fontWeight: 'bold',
        fontSize: '1.5rem',
        flexShrink: 0,
        order: isFooter ? { xs: 1, md: 2 } : { xs: 2, md: 1 },
      }}
    >
      <Typography
        variant="h6"
        sx={{ color: 'primary.main', fontWeight: 'bold' }}
      >
        EcoRide
      </Typography>
      <Box
        component="img"
        src={ecorideLogo}
        alt="EcoRide Logo"
        sx={{ height: isFooter ? 62 : 40 }}
      />
    </Stack>
  );
};
