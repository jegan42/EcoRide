// frontend/src/component/trip/TripDetails.tsx
import { Box, Divider, Stack } from '@mui/material';
import type { Trip } from '../../types/trip';
import { FindTripInfoDriver } from '../findtrip/FindTripInfoDriver';
import { FindTripInfoDriverPreferences } from '../findtrip/FindTripInfoDriverPreferences';
import { FindTripInfoTrip } from '../findtrip/FindTripInfoTrip';
import { FindTripInfoVehicle } from '../findtrip/FindTripInfoVehicle';
import type { User } from '../../types/user';
import type { Vehicle } from '../../types/vehicle';

interface Props {
  trip: Partial<Trip & { driver: Partial<User>; vehicle: Partial<Vehicle> }>;
  allInfo?: boolean;
  width?: string;
}

export const TripDetails: React.FC<Props> = ({
  trip,
  allInfo = false,
  width = 'inherit',
}) => {
  return (
    <Stack spacing={0} width={width}>
      <Box p={2}>
        <FindTripInfoDriver driver={trip.driver} allInfo={allInfo} />
      </Box>
      <Divider />
      <Box p={2}>
        <FindTripInfoTrip trip={trip} allInfo={allInfo} />
      </Box>
      <Divider />
      <Box p={2}>
        <FindTripInfoVehicle vehicle={trip.vehicle} allInfo={allInfo} />
      </Box>
      <Divider />
      {allInfo && trip.driverId && (
        <>
          <Divider />
          <Box p={2}>
            <FindTripInfoDriverPreferences id={trip.driverId} />
          </Box>
        </>
      )}
    </Stack>
  );
};
