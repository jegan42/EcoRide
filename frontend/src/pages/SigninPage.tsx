// frontend/src/pages/SigninPage.tsx
import { useEffect, useState, type JSX } from 'react';
import { Box, Button, Typography } from '@mui/material';
import SignupForm, { type SignupFormData } from '../forms/SignupForm';
import SigninForm, { type SigninFormData } from '../forms/SigninForm';
import authService from '../services/authService';
import { useDispatch } from 'react-redux';
import { signin as signinAction } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import AuthTabs from '../components/auth/AuthTabs';
import { API_URL } from '../constants/api';
import GoogleIcon from '@mui/icons-material/Google';
import {
  enqueueSnackbarError,
  enqueueSnackbarSuccess,
} from '../utils/enqueueSnackbar';

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
      const { message, data: user } = await authService.signin(data);
      dispatch(signinAction({ user, isAuthenticated: true }));
      enqueueSnackbarSuccess(message);
      void navigate('/');
    } catch (error) {
      enqueueSnackbarError(error);
    }
  };

  const handleSignupSubmit = async (data: SignupFormData): Promise<void> => {
    try {
      const { message, data: user } = await authService.signup(data);
      dispatch(
        signinAction({
          user,
          isAuthenticated: true,
        })
      );
      enqueueSnackbarSuccess(message);
      void navigate('/');
    } catch (error) {
      enqueueSnackbarError(error);
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
                display: 'flex',
                gap: 1,
                fontWeight: 'bold',
                fontSize: 16,
              }}
              onClick={() => {
                window.location.href = `${API_URL}/auth/google`;
              }}
            >
              <GoogleIcon />
              <span>Se connecter avec Google</span>
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
