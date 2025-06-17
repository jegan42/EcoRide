// frontend/src/pages/TripDetailsPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Stack,
  Divider,
  Button,
} from '@mui/material';
import { useTrip } from '../hooks/useTrip';
import { FindTripInfoDriver } from '../components/findtrip/FindTripInfoDriver';
import { FindTripInfoTrip } from '../components/findtrip/FindTripInfoTrip';
import { FindTripInfoVehicle } from '../components/findtrip/FindTripInfoVehicle';
import { FindTripInfoDriverPreferences } from '../components/findtrip/FindTripInfoDriverPreferences';

export const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchTripById, selectedTrip, loading } = useTrip();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    const loadTrip = async (): Promise<void> => {
      if (id) {
        const success = await fetchTripById(id);
        if (success) setLoaded(true);
      }
    };
    void loadTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading || !loaded) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedTrip) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h6">Trajet non trouvé.</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="800px" mx="auto" mt={4} p={2} width={'100%'}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Détails du trajet
      </Typography>

      <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Stack spacing={0}>
          <Box p={2} borderBottom="1px solid #ccc">
            <FindTripInfoDriver driver={selectedTrip.driver} allInfo={true} />
          </Box>

          <Box p={2} borderBottom="1px solid #ccc">
            <FindTripInfoTrip trip={selectedTrip} allInfo={true} />
          </Box>

          <Box p={2} borderBottom="1px solid #ccc">
            <FindTripInfoVehicle
              vehicle={selectedTrip.vehicle}
              allInfo={true}
            />
          </Box>

          <Box p={2}>
            <FindTripInfoDriverPreferences id={selectedTrip.driverId} />
          </Box>

          <Divider />
          <Box
            display="flex"
            justifyContent="center"
            gap={2}
            py={2}
            flexWrap="wrap"
          >
            <Button variant="contained" color="primary">
              Réserver
            </Button>
            <Button variant="outlined" color="primary" href="/findtrip">
              Retour
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};
