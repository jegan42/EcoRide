//frontend/src/layouts/AppLayout.tsx
import { type JSX } from 'react';
import { Outlet } from 'react-router-dom';
import Container from '@mui/material/Container';
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
      }}
    >
      <Header />
      <Container
        sx={{
          my: { xs: 1, md: 2 },
          flexGrow: 1,
          display: 'flex',
          px: 2,
        }}
      >
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};
