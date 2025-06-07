// frontend/src/components/footer/Footer.tsx
import type { JSX } from 'react';
import { Box } from '@mui/material';
import { Logo } from '../Logo';
import { FooterInfo } from './FooterInfo';
import { FooterNav } from './FooterNav';

export const Footer = (): JSX.Element => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        color: 'primary.main',
        px: { xs: 2, md: 5 },
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 15 },
      }}
    >
      <Logo isFooter={true} />
      <FooterInfo />
      <FooterNav />
    </Box>
  );
};
