// frontend/src/components/auth/AuthTabs.tsx
import { Button, Box } from '@mui/material';
import type { JSX } from 'react';
import theme from '../../styles/theme';

interface AuthTabsProps {
  active: boolean;
  onChange: (value: boolean) => void;
}

const tabButtonStyle = (
  active: boolean,
  left: boolean = true
): Record<string, unknown> => ({
  fullWidth: true,
  disableRipple: true,
  sx: {
    borderRadius: 0,
    color: theme.palette.primary.dark,
    borderBottom: active ? `3px solid ${theme.palette.text.primary}` : 'none',
    borderRight: left ? `1px solid ${theme.palette.text.primary}` : 'none',
    borderLeft: !left ? `1px solid ${theme.palette.text.primary}` : 'none',
    fontWeight: active ? 700 : 400,
    backgroundColor: 'transparent',
    '&:hover': {
      fontWeight: 700,
      backgroundColor: 'transparent',
    },
  },
});

export const AuthTabs = ({ active, onChange }: AuthTabsProps): JSX.Element => {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        borderBottom: `2px solid ${theme.palette.text.primary}`,
      })}
    >
      <Button
        variant="text"
        {...tabButtonStyle(active)}
        onClick={() => onChange(true)}
      >
        Se connecter
      </Button>
      <Button
        variant="text"
        {...tabButtonStyle(!active, false)}
        onClick={() => onChange(false)}
      >
        S’inscrire
      </Button>
    </Box>
  );
};
