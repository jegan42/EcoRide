// frontend/src/component/profile/ProfileTabs.tsx
import { Button, Box } from '@mui/material';
import type { JSX } from 'react';
import theme from '../../styles/theme';
import { useIsDriver } from '../../hooks/useIsDriver';

export type ProfileTabsMode = 'preference' | 'vehicle' | 'trip' | 'booking';

const ProfileTabButtonStyle = (
  active: boolean,
  left: boolean
): Record<string, unknown> => ({
  fullWidth: true,
  disableRipple: true,
  sx: {
    borderRadius: 0,
    flex: '1 1 50%',
    minWidth: 120,
    color: theme.palette.primary.dark,
    borderBottom: active
      ? `3px solid ${theme.palette.text.primary}`
      : `2px solid ${theme.palette.text.primary}`,
    borderRight: { xs: `1px solid ${theme.palette.text.primary}`, md: 'none' },
    borderLeft: {
      xs: `2px solid ${theme.palette.text.primary}`,
      md: !left ? `2px solid ${theme.palette.text.primary}` : 'none',
    },
    fontWeight: active ? 700 : 400,
    backgroundColor: 'transparent',
    '&:hover': {
      fontWeight: 700,
      backgroundColor: 'transparent',
    },
  },
});

interface ProfileTabsProps {
  profileTabs: ProfileTabsMode;
  onChange: (value: ProfileTabsMode) => void;
}

export const ProfileTabs = ({
  profileTabs,
  onChange,
}: ProfileTabsProps): JSX.Element => {
  const driver = useIsDriver();
  const tabs: { key: ProfileTabsMode; label: string; show: boolean }[] = [
    { key: 'preference', label: 'Préférences', show: true },
    { key: 'vehicle', label: 'Véhicules', show: driver },
    { key: 'trip', label: 'Voyages', show: driver },
    { key: 'booking', label: 'Réservation', show: true },
  ];
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: { xs: 'wrap', md: 'nowrap' },
        width: '100%',
        mx: 'auto',
      }}
      id="bonjour"
    >
      {tabs
        .filter((tab) => tab.show)
        .map((tab, index) => (
          <Button
            key={tab.key}
            variant="text"
            {...ProfileTabButtonStyle(profileTabs === tab.key, index === 0)}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
    </Box>
  );
};
