// frontend/src/pages/SigninPage.tsx
import { type JSX } from 'react';
import { Box, Button, Typography } from '@mui/material';
import SignupForm from '../forms/SignupForm';
import SigninForm from '../forms/SigninForm';
import { API_URL } from '../constants/api';
import GoogleIcon from '@mui/icons-material/Google';
import { AuthTabs } from '../components/auth/AuthTabs';
import { useSign } from '../hooks/useSign';

const SigninPage = (): JSX.Element => {
  const { signin, setSignin, handleSignupSubmit, handleSigninSubmit } =
    useSign();

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
