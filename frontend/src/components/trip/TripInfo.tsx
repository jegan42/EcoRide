// frontend/src/component/trip/TripInfo.tsx
import { Paper, Box, Stack } from '@mui/material';
import type { Trip } from '../../types/trip';
import { VehicleCard } from '../vehicle/VehicleCard';
import { TripCard } from './TripCard';
import { useIsMobile } from '../../hooks/useIsMobile';

interface Props {
  trip?: Trip;
  onEdit: (id: string) => void;
  onStart: (id: string) => void;
  onArrived: (id: string) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

export const TripInfo: React.FC<Props> = ({
  trip,
  onEdit,
  onStart,
  onArrived,
  onDelete,
  isAdmin = false,
}) => {
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
        spacing={{ xs: 5, sm: 2 }}
        alignItems="stretch"
        flexWrap="wrap"
      >
        <Box flex={1} minWidth={0}>
          <VehicleCard vehicle={trip?.vehicle} />
        </Box>
        <Box flex={2} minWidth={0}>
          <TripCard
            trip={trip}
            onEdit={onEdit}
            onStart={onStart}
            onArrived={onArrived}
            onDelete={onDelete}
            isAdmin={isAdmin}
          />
        </Box>
      </Stack>
    </Paper>
  );
};
