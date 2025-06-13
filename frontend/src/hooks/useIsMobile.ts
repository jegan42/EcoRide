// frontend/src/hooks/useIsMobile.ts
import { useMediaQuery, useTheme } from '@mui/material';

export const useIsMobile = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
};
