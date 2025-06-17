// frontend/src/component/findtrip/FindTripCard.tsx
import { Paper, Box, Stack, Button } from '@mui/material';
import type { Vehicle } from '../../types/vehicle';
import type { Trip } from '../../types/trip';
import type { User } from '../../types/user';
import { useIsMobile } from '../../hooks/useIsMobile';
import { FindTripInfoTrip } from './FindTripInfoTrip';
import { FindTripInfoDriver } from './FindTripInfoDriver';
import { FindTripInfoVehicle } from './FindTripInfoVehicle';

interface Props {
  trip?: Partial<Trip> & {
    vehicle?: Partial<Vehicle>;
    driver?: Partial<User>;
  };
  onBook?: () => void;
  onDetails?: () => void;
}

export const FindTripCard: React.FC<Props> = ({ trip, onBook, onDetails }) => {
  const isMobile = useIsMobile();
  const stackDirection = isMobile ? 'column' : 'row';
  const wdthContainer = isMobile ? '100%' : '260px';

  return (
    <Paper
      elevation={3}
      sx={(theme) => ({
        width: wdthContainer,
        maxWidth: '100%',
        mt: 4,
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
          <Paper
            elevation={3}
            sx={(theme) => ({
              p: 2,
              borderTopLeftRadius: '1rem !important',
              borderTopRightRadius: '1rem !important',
              borderBottomLeftRadius: '0 !important',
              borderBottomRightRadius: '0 !important',
              border: `2px solid ${theme.palette.primary.main}`,
            })}
          >
            <FindTripInfoDriver driver={trip?.driver} />
          </Paper>
          <Paper
            elevation={3}
            sx={(theme) => ({
              p: 2,
              borderRadius: 0,
              border: `2px solid ${theme.palette.primary.main}`,
            })}
          >
            <FindTripInfoTrip trip={trip} />
          </Paper>
          <Paper
            elevation={3}
            sx={(theme) => ({
              p: 2,
              borderRadius: 0,
              border: `2px solid ${theme.palette.primary.main}`,
            })}
          >
            <FindTripInfoVehicle vehicle={trip?.vehicle} />
          </Paper>
          <Paper
            elevation={3}
            sx={(theme) => ({
              p: 2,
              borderTopLeftRadius: '0 !important',
              borderTopRightRadius: '0 !important',
              borderBottomLeftRadius: '1rem !important',
              borderBottomRightRadius: '1rem !important',
              border: `2px solid ${theme.palette.primary.main}`,
            })}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                maxHeight: 64,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={onBook}
                sx={{ width: '45%' }}
                aria-label="Réserver ce trajet"
              >
                Réserver
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={onDetails}
                sx={{ width: '45%' }}
                aria-label="Voir les détails du trajet"
              >
                Détails
              </Button>
            </Box>
          </Paper>
        </Box>
      </Stack>
    </Paper>
  );
};
