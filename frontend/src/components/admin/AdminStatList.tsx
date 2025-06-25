// frontend/src/components/admin/AdminStatList.tsx
import React from 'react';
import { Box, Typography, Stack, Paper } from '@mui/material';
import { AdminStatHead } from '../../components/admin/AdminStatHead';
import { MonthlyUsersChart } from '../../components/chart/MonthlyUsersChart';
import type { User } from '../../types/user';
import type { Trip } from '../../types/trip';
import type { Contact } from '../../types/contact';
import type { ChartData } from '../../hooks/useAdmin';
import { StatPieChart } from '../chart/StatPieChart';
import { WeeklyDataChart } from '../chart/WeeklyDataChart';
import { StatBarChart } from '../chart/StatBarChart';

interface Props {
  allUsers: User[];
  allTrips: Trip[];
  allContacts: Contact[];
  chartDataToSet: ChartData;
}

export const AdminStatList: React.FC<Props> = ({
  allUsers,
  allTrips,
  allContacts,
  chartDataToSet,
}) => {
  return (
    <Stack spacing={2} mt={4} width={'100%'}>
      <Typography variant="h5" gutterBottom>
        Statistiques
      </Typography>
      <AdminStatHead
        nbUsers={allUsers.length}
        nbDrivers={allUsers.filter((u) => u.role.includes('driver')).length}
        nbPassengers={
          allUsers.filter((u) => u.role.includes('passenger')).length
        }
        nbTrips={allTrips.length}
        nbContacts={allContacts.length}
      />
      <Box sx={{ width: '100%' }}>
        <MonthlyUsersChart data={chartDataToSet.monthlyUsers} />
      </Box>
      <Box display={'flex'} gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
        <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
          <StatBarChart chartDataToSet={chartDataToSet} />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
          <WeeklyDataChart chartDataToSet={chartDataToSet} />
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
