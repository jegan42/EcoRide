// frontend/src/component/findtrip/FindTripCard.tsx
import { Paper, Box, Stack, Button } from '@mui/material';
import type { Vehicle } from '../../types/vehicle';
import type { Trip } from '../../types/trip';
import type { User } from '../../types/user';
import { TripDetails } from '../trip/TripDetails';

interface Props {
  trip?: Partial<Trip> & {
    vehicle?: Partial<Vehicle>;
    driver?: Partial<User>;
  };
  onBook?: () => void;
  onDetails?: () => void;
}

export const FindTripCard: React.FC<Props> = ({ trip, onBook, onDetails }) => {
  return (
    <Paper
      elevation={3}
      sx={(theme) => ({
        width: { xs: '100%', sm: '260px' },
        maxWidth: '100%',
        mt: 4,
        borderRadius: 3,
        border: `2px solid ${theme.palette.primary.main}`,
      })}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="stretch"
        flexWrap="wrap"
      >
        <Box
          flex={2}
          minWidth={0}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          {trip && <TripDetails trip={trip} />}
          <Box p={2}>
            {(onBook || onDetails) && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  maxHeight: 64,
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                {onBook && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onBook}
                    sx={{ width: '45%' }}
                    aria-label="Réserver ce trajet"
                  >
                    Réserver
                  </Button>
                )}
                {onDetails && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onDetails}
                    sx={{ width: '45%' }}
                    aria-label="Voir les détails du trajet"
                  >
                    Détails
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
};
