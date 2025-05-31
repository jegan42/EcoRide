//frontend/src/layouts/AppLayout.tsx
import { useEffect, type JSX } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Container from '@mui/material/Container';
import Footer from '../components/Footer';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import userService from '../services/userService';
import { useAppSelector } from '../hooks/useAppSelector';
import { setAuthLoading, signin, signout } from '../store/slices/authSlice';

const AppLayout = (): JSX.Element => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      const initAuth = async (): Promise<void> => {
        dispatch(setAuthLoading(true));
        try {
          const { message: _, data: user } = await userService.fetchUser();
          dispatch(signin({ user, isAuthenticated: true }));
        } catch {
          dispatch(signout());
        } finally {
          dispatch(setAuthLoading(false));
        }
      };
      void initAuth();
    }
  }, [dispatch, isAuthenticated]);

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

export default AppLayout;
