// frontend/src/components/admin/AdminStatList.tsx
import React from 'react';
import { Box, Typography, Stack, Paper } from '@mui/material';
import { AdminStatHead } from '../../components/admin/AdminStatHead';
import { MonthlyUsersChart } from '../../components/chart/MonthlyUsersChart';
import { useAdmin } from '../../hooks/useAdmin';
import { StatPieChart } from '../chart/StatPieChart';
import { StatLineChart } from '../chart/StatLineChart';
import { StatBarChart } from '../chart/StatBarChart';

export const AdminStatList: React.FC = () => {
  const { allUsers, allTrips, allBookings, allContacts, chartDataToSet } =
    useAdmin();
  return (
    <Stack spacing={2} mt={4} width={'100%'}>
      <Typography variant="h5" gutterBottom>
        Statistiques
      </Typography>
      <AdminStatHead
        commissionTotal={chartDataToSet.commissionTotal}
        nbUsers={allUsers.length}
        nbDrivers={allUsers.filter((u) => u.role.includes('driver')).length}
        nbPassengers={
          allUsers.filter((u) => u.role.includes('passenger')).length
        }
        nbTrips={allTrips.length}
        nbBookings={allBookings.length}
        nbContacts={allContacts.length}
      />
      <Box
        display={'flex'}
        gap={2}
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems="stretch"
      >
        <Box display={'flex'} sx={{ width: { xs: '100%', sm: '50%' } }}>
          <StatBarChart
            title="Réservation du mois"
            chartDataToSet={chartDataToSet.bookingsThisMonthByDay}
          />
        </Box>
        <Box display={'flex'} sx={{ width: { xs: '100%', sm: '50%' } }}>
          <StatBarChart
            title="Réservation de la semaine"
            chartDataToSet={chartDataToSet.bookingsThisWeekByDay}
          />
        </Box>
      </Box>
      <Box
        display={'flex'}
        gap={2}
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems="stretch"
      >
        <Box display={'flex'} sx={{ width: { xs: '100%', sm: '50%' } }}>
          <StatBarChart
            title="Comission du mois"
            chartDataToSet={chartDataToSet.commissionThisMonthByDay}
          />
        </Box>
        <Box display={'flex'} sx={{ width: { xs: '100%', sm: '50%' } }}>
          <StatBarChart
            title="Réservation de la semaine"
            chartDataToSet={chartDataToSet.commissionThisMonthByDay}
          />
        </Box>
      </Box>
      <Box
        display={'flex'}
        gap={2}
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems="stretch"
      >
        <Box display={'flex'} sx={{ width: { xs: '100%', sm: '50%' } }}>
          <MonthlyUsersChart data={chartDataToSet.monthlyUsers} />
        </Box>
        <Box display={'flex'} sx={{ width: { xs: '100%', sm: '50%' } }}>
          <StatLineChart
            period={'de la semaine'}
            dataSet={[
              { title: 'trajets', data: chartDataToSet.tripsThisWeekByDay },
              { title: 'contacts', data: chartDataToSet.contactsThisWeekByDay },
              { title: 'connexions', data: chartDataToSet.loginsThisWeekByDay },
              {
                title: 'réservation',
                data: chartDataToSet.bookingsThisWeekByDay,
              },
            ]}
          />
        </Box>
      </Box>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Répartition des rôles
        </Typography>
        <Box
          display={'flex'}
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent={'space-between'}
        >
          <Stack width={{ xs: '100%', sm: '30%' }}>
            <StatPieChart
              title="Rôles utilisateurs"
              dataToSet={chartDataToSet.roleDistribution}
            />
          </Stack>
          <Stack width={{ xs: '100%', sm: '30%' }}>
            <StatPieChart
              title="Rôles simplifiée"
              dataToSet={chartDataToSet.simplifiedRoleDistribution}
            />
          </Stack>
          <Stack width={{ xs: '100%', sm: '30%' }}>
            <StatPieChart
              title="Chauffeur/Passager"
              dataToSet={chartDataToSet.driverVsUsers}
            />
          </Stack>
        </Box>
      </Paper>
    </Stack>
  );
};
