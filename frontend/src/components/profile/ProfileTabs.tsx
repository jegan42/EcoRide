// frontend/src/component/profile/ProfileTabs.tsx
import { Button, Box, Stack } from '@mui/material';
import type { JSX } from 'react';
import theme from '../../styles/theme';
import { useIsDriver } from '../../hooks/useIsDriver';

export type ProfileTabsMode =
  | 'preference'
  | 'vehicle'
  | 'trip'
  | 'booking'
  | 'review'
  | 'history';

interface ProfileTabsProps {
  profileTabs: ProfileTabsMode;
  onChange: (value: ProfileTabsMode) => void;
}

const TabButton = ({
  label,
  active,
  left,
  onClick,
}: {
  label: string;
  active: boolean;
  left: boolean;
  onClick: () => void;
}): JSX.Element => (
  <Button
    variant="text"
    fullWidth
    disableRipple
    onClick={onClick}
    role="tab"
    aria-selected={active}
    sx={{
      borderRadius: 0,
      flex: '1 1 50%',
      minWidth: 120,
      color: theme.palette.primary.dark,
      borderBottom: active
        ? `3px solid ${theme.palette.text.primary}`
        : `2px solid ${theme.palette.text.primary}`,
      borderRight: {
        xs: `1px solid ${theme.palette.text.primary}`,
        md: 'none',
      },
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
    }}
  >
    {label}
  </Button>
);

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

  const tabs2: { key: ProfileTabsMode; label: string; show: boolean }[] = [
    { key: 'review', label: 'Avis', show: true },
    { key: 'history', label: 'Historique', show: true },
  ];

  return (
    <Stack direction="column">
      <Box
        role="tablist"
        sx={{
          display: 'flex',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          width: '100%',
          mx: 'auto',
        }}
      >
        {tabs
          .filter((tab) => tab.show)
          .map((tab, index) => (
            <TabButton
              key={tab.key}
              label={tab.label}
              active={profileTabs === tab.key}
              left={index === 0}
              onClick={() => onChange(tab.key)}
            />
          ))}
      </Box>
      <Box
        role="tablist"
        sx={{
          display: 'flex',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          width: '100%',
          mx: 'auto',
        }}
      >
        {tabs2
          .filter((tab) => tab.show)
          .map((tab, index) => (
            <TabButton
              key={tab.key}
              label={tab.label}
              active={profileTabs === tab.key}
              left={index === 0}
              onClick={() => onChange(tab.key)}
            />
          ))}
      </Box>
    </Stack>
  );
};
