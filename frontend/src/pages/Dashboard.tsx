// frontend/src/pages/Dashboard.tsx
import React from 'react';
import { Box, Collapse, Container, Paper, Typography } from '@mui/material';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { useDashboardState } from '../hooks/useDashboardState';
import { DashboardListSwitch } from '../components/dashboard/DashboardListSwitch';
import { DashboardFormSwitch } from '../components/dashboard/DashboardFormSwitch';
import { ProfileView } from '../components/profile/ProfileView';
import { useFirebaseLogin } from '../hooks/useFirebaseLogin';

const DashboardPage: React.FC = () => {
  const isLoading = useFirebaseLogin();

  const {
    dashboardMode,
    setDashboardMode,
    selectedData,
    setSelectedData,
    profileTabs,
    setProfileTabs,
    isViewMode,
  } = useDashboardState();

  if (isLoading) return '...chargement';

  return (
    <Container maxWidth="md" sx={{ my: 4, px: { xs: 1, sm: 2, md: 4 } }}>
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
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ minWidth: '100%' }}
          >
            <DashboardHeader />
            <DashboardFormSwitch
              dashboardMode={dashboardMode}
              setDashboardMode={setDashboardMode}
              selectedData={selectedData}
            />
            {isViewMode && (
              <Collapse in={isViewMode} sx={{ minWidth: '100%' }}>
                <ProfileView
                  profileTabs={profileTabs}
                  onSetProfileTabs={setProfileTabs}
                  setDashboardMode={setDashboardMode}
                />
                <DashboardListSwitch
                  profileTabs={profileTabs}
                  setDashboardMode={setDashboardMode}
                  setSelectedData={setSelectedData}
                />
              </Collapse>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default DashboardPage;
