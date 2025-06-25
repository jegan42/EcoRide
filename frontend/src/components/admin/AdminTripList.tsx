// frontend/src/components/admin/AdminTripList.tsx
import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { TripInfo } from '../../components/trip/TripInfo';
import type { Trip } from '../../types/trip';
import type { AdminFormMode } from '../../types/admin';

interface Props {
  setViewMode: (mode: AdminFormMode) => void;
  allTrips: Trip[];
  setSelectedTrip: (trip: Trip) => void;
}

export const AdminTripList: React.FC<Props> = ({
  setViewMode,
  allTrips,
  setSelectedTrip,
}) => {
  return (
    <Stack spacing={2} mt={4}>
      <Typography variant="h5" gutterBottom>
        Liste des Trajets
      </Typography>
      {allTrips.map((trip) => {
        return (
          <Box key={trip.id}>
            <TripInfo
              key={trip?.id}
              trip={trip}
              onEdit={() => {
                setViewMode('tripEdit');
                setSelectedTrip(trip);
              }}
              onDelete={() => {
                setViewMode('tripDelete');
                setSelectedTrip(trip);
              }}
              isAdmin={true}
            />
          </Box>
        );
      })}
    </Stack>
  );
};
