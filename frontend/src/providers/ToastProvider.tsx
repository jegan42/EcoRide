// frontend/frontend/src/providers/ToastProvider.tsx
import { SnackbarProvider } from 'notistack';
import { Slide } from '@mui/material';
import type { JSX } from 'react';

const ToastProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={Slide}
    >
      {children}
    </SnackbarProvider>
  );
};

export default ToastProvider;
