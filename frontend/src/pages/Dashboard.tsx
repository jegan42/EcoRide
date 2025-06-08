// frontend/src/pages/Dashboard.tsx
import React from 'react';
import { Box, Collapse, Container, Paper, Typography } from '@mui/material';
import { useProfile } from '../hooks/useProfile';
import { useVehicle } from '../hooks/useVehicle';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { useModes } from '../hooks/useModes';
import { DashboardListSwitch } from '../components/dashboard/DashboardListSwitch';
import { DashboardFormSwitch } from '../components/dashboard/DashboardFormSwitch';
import { ProfileView } from '../components/profile/ProfileView';
import { ProfileLoading } from '../components/profile/ProfileLoading';

const DashboardPage: React.FC = () => {
  const { isDriver } = useProfile();
  const { loading, error } = useVehicle();

  const {
    profileMode,
    setProfileMode,
    preferencesMode,
    setPreferencesMode,
    vehicleMode,
    setVehicleMode,
    selectedVehicle,
    setSelectedVehicle,
    profileTabs,
    setProfileTabs,
    isViewMode,
  } = useModes();

  if (isDriver && error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, px: { xs: 1, sm: 2, md: 4 } }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
          width: '100%',
          maxWidth: '800px',
          mx: 'auto',
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={(theme) => ({
              color: theme.palette.primary.main,
              my: 2,
            })}
          >
            Mon Tableau de Bord
          </Typography>
          {loading ? (
            <ProfileLoading />
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{ minWidth: '100%' }}
            >
              <DashboardHeader />
              <DashboardFormSwitch
                profileMode={profileMode}
                onSetProfileMode={setProfileMode}
                preferencesMode={preferencesMode}
                onSetPreferencesMode={setPreferencesMode}
                vehicleMode={vehicleMode}
                onSetVehicleMode={setVehicleMode}
                selectedVehicle={selectedVehicle}
              />
              {isViewMode && (
                <Collapse in={isViewMode} sx={{ minWidth: '100%' }}>
                  <ProfileView
                    onSetProfileMode={() => setProfileMode('edit')}
                    onSetVehicleMode={() => setVehicleMode('add')}
                    profileTabs={profileTabs}
                    onSetProfileTabs={setProfileTabs}
                  />
                  <DashboardListSwitch
                    profileTabs={profileTabs}
                    onSetPreferencesMode={setPreferencesMode}
                    onSetVehicleMode={setVehicleMode}
                    onSetSelectedVehicle={setSelectedVehicle}
                  />
                </Collapse>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default DashboardPage;
