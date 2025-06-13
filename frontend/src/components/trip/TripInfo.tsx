// frontend/src/component/trip/TripInfo.tsx
import { Paper, Box, Stack } from '@mui/material';
import type { Vehicle } from '../../types/vehicle';
import type { Trip } from '../../types/trip';
import type { User } from '../../types/user';
import { VehicleCard } from '../vehicle/VehicleCard';
import { TripCard } from './TripCard';
import { useIsMobile } from '../../hooks/useIsMobile';

interface Props {
  trip?: Partial<Trip> & {
    vehicle?: Partial<Vehicle>;
    driver?: Partial<User>;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TripInfo: React.FC<Props> = ({ trip, onEdit, onDelete }) => {
  const isMobile = useIsMobile();
  const stackDirection = isMobile ? 'column' : 'row';

  return (
    <Paper
      elevation={3}
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mt: 4,
        p: 2,
        borderRadius: 3,
        border: `2px solid ${theme.palette.primary.main}`,
      })}
    >
      <Stack
        direction={stackDirection}
        spacing={2}
        alignItems="stretch"
        flexWrap="wrap"
      >
        <Box flex={1} minWidth={0}>
          <VehicleCard vehicle={trip?.vehicle} />
        </Box>
        <Box flex={2} minWidth={0}>
          <TripCard trip={trip} onEdit={onEdit} onDelete={onDelete} />
        </Box>
      </Stack>
    </Paper>
  );
};
