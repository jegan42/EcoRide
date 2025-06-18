// frontend/src/pages/TripDetailsPage.tsx
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { TripDetails } from '../components/trip/TripDetails';
import { FindTripDialogContent } from '../components/findtrip/FindTripDialogContent';
import { ConfirmDialog } from '../components/dailog/ConfirmDialog';
import { useBookingsDialog } from '../hooks/useBookingsDialog';

export const TripDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { fetchTripById, selectedTrip, loading } = useTrip();

  useEffect(() => {
    if (id) void fetchTripById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const {
    dialogTrip,
    submitting,
    handleCloseBooking,
    handleConfirm,
    seats,
    setSeats,
    handleOpenBooking,
  } = useBookingsDialog();

  if (loading) {
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
          <TripDetails trip={selectedTrip} allInfo={true} />

          <Divider />
          <Box
            display="flex"
            justifyContent="center"
            gap={2}
            py={2}
            flexWrap="wrap"
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenBooking(selectedTrip)}
              disabled={!selectedTrip?.availableSeats}
            >
              Réserver
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/findtrip')}
            >
              Retour
            </Button>
          </Box>
        </Stack>
      </Paper>

      {dialogTrip && (
        <ConfirmDialog
          title={'Réserver un trajet'}
          open={!!dialogTrip}
          submitting={submitting}
          onClose={handleCloseBooking}
          onConfirm={() => handleConfirm(dialogTrip)}
        >
          <FindTripDialogContent
            trip={dialogTrip}
            maxSeats={dialogTrip.availableSeats || 1}
            seats={seats}
            setSeats={setSeats}
          />
        </ConfirmDialog>
      )}
    </Box>
  );
};
