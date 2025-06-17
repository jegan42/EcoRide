//frontend/src/layouts/AppLayout.tsx
import { type JSX } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { useInitApp } from '../hooks/useInitApp';
import { Header } from '../components/header/Header';
import { Footer } from '../components/footer/Footer';

export const AppLayout = (): JSX.Element => {
  useInitApp();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        p: 0,
        m: 0,
      }}
    >
      <Header />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          p: 0,
          m: 0,
        }}
        aria-label="main content"
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};
