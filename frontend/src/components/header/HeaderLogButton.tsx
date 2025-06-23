// frontend/src/components/header/HeaderLogButton.tsx
import { Button } from '@mui/material';
import type { JSX } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useNavigate } from 'react-router-dom';

interface Props {
  logoutButtonRef: React.RefObject<HTMLButtonElement | null>;
  loginButtonRef: React.RefObject<HTMLButtonElement | null>;
  onSignoutSubmit: () => Promise<void>;
}

export const HeaderLogButton: React.FC<Props> = ({
  logoutButtonRef,
  loginButtonRef,
  onSignoutSubmit,
}): JSX.Element => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const onSignout = (): void => {
    void onSignoutSubmit();
    void navigate('/');
  };

  if (isAuthenticated) {
    return (
      <Button
        ref={logoutButtonRef}
        variant="contained"
        color="primary"
        sx={{ borderRadius: 2, textTransform: 'none' }}
        onClick={onSignout}
      >
        Déconnexion
      </Button>
    );
  } else {
    return (
      <Button
        ref={loginButtonRef}
        variant="contained"
        color="primary"
        sx={{ borderRadius: 2, textTransform: 'none' }}
        onClick={() => navigate('/signin')}
      >
        Connexion
      </Button>
    );
  }
};
