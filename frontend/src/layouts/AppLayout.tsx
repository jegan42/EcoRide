//frontend/src/layouts/AppLayout.tsx
import type { JSX } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Container from '@mui/material/Container';
import Footer from '../components/Footer';
import { Box } from '@mui/material';

const AppLayout = (): JSX.Element => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // prend toute la hauteur de la fenêtre
      }}
    >
      <Header />
      <Container sx={{ mt: 4, flexGrow: 1 }}>
        {' '}
        {/* flexGrow pousse le Container à prendre l’espace restant */}
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};

export default AppLayout;
