// src/providers/ToastProvider.tsx
import { SnackbarProvider } from 'notistack';
import { Slide } from '@mui/material';

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
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
