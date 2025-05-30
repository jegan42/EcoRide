// frontend/src/pages/SigninPage.tsx
import { useEffect, useState, type JSX } from 'react';
import { Box, Button, Typography } from '@mui/material';
import SignupForm, { type SignupFormData } from '../forms/SignupForm';
import SigninForm, { type SigninFormData } from '../forms/SigninForm';
import authService from '../services/authService';
import { useDispatch } from 'react-redux';
import { signin as signinAction } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';
import { useAppSelector } from '../hooks/useAppSelector';
import AuthTabs from '../components/auth/AuthTabs';
import { API_URL } from '../constants/api';

const SigninPage = (): JSX.Element => {
  const [signin, setSignin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      void navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSigninSubmit = async (data: SigninFormData): Promise<void> => {
    try {
      const user = await authService.signin(data);
      dispatch(
        signinAction({
          user: user,
          isAuthenticated: true,
        })
      );
      enqueueSnackbar('Connexion envoyée !', { variant: 'success' });
      void navigate('/');
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Échec de la connexion, veuillez réessayer';
      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  const handleSignupSubmit = async (data: SignupFormData): Promise<void> => {
    try {
      const user = await authService.signup(data);
      dispatch(
        signinAction({
          user: user,
          isAuthenticated: true,
        })
      );
      enqueueSnackbar('Inscription envoyée !', { variant: 'success' });
      void navigate('/');
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Échec de l’inscription, veuillez réessayer';
      enqueueSnackbar(message, { variant: 'error' });
    }
  };
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <AuthTabs active={signin} onChange={setSignin} />
      <Box
        sx={{
          maxWidth: 400,
          p: 2,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1, md: 2 },
        }}
      >
        {!signin ? (
          <SignupForm onSubmit={handleSignupSubmit} />
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              sx={{
                fontWeight: 'bold',
                fontSize: 16,
              }}
              onClick={() => {
                window.location.href = `${API_URL}/auth/google`;
              }}
            >
              Se connecter avec Google
            </Button>
            <Typography
              sx={{
                textAlign: 'center',
                borderTop: '1px solid black',
                borderBottom: '1px solid black',
                py: 0.2,
                fontWeight: 'bold',
              }}
            >
              OU
            </Typography>
            <SigninForm onSubmit={handleSigninSubmit} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default SigninPage;
