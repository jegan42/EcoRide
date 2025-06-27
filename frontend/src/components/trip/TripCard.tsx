// frontend/src/component/trip/TripCard.tsx
import { Paper, Box, Stack, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import type { Trip } from '../../types/trip';
import { useDialog } from '../../hooks/useDialog';
import { ConfirmDialog } from '../dailog/ConfirmDialog';
import { formatDateTime } from '../../utils/formatDateTime';
import { formatField } from '../../utils/formatField';

interface Props {
  trip?: Trip;
  onEdit: (id: string) => void;
  onStart: (id: string) => void;
  onArrived: (id: string) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

export const TripCard: React.FC<Props> = ({
  trip,
  onEdit,
  onStart,
  onArrived,
  onDelete,
  isAdmin = false,
}) => {
  const { dialogOpen, setDialogOpen, handleDeleteClick, handleConfirmDelete } =
    useDialog();

  const tripId = trip?.id;

  const isPassedTrip = trip?.departureDate
    ? new Date(trip.departureDate) < new Date()
    : false;

  return (
    <Paper
      elevation={3}
      sx={(theme) => ({
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: `2px solid ${theme.palette.primary.main}`,
        gap: 2,
        textTransform: 'capitalize',
      })}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Stack spacing={1}>
          <Typography variant="subtitle2" fontWeight={700}>
            Trajet
          </Typography>
          <Typography variant="body2">
            {trip?.departureCity} → {trip?.arrivalCity}
          </Typography>
          <Typography variant="body2">
            Départ : {formatDateTime(trip?.departureDate)}
          </Typography>
          <Typography variant="body2">
            Arrivée : {formatDateTime(trip?.arrivalDate)}
          </Typography>
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2" fontWeight={700}>
            Infos
          </Typography>
          <Typography variant="body2">
            Prix : {formatField(trip?.price)} €
          </Typography>
          <Typography variant="body2">
            Places dispo : {formatField(trip?.availableSeats)}
          </Typography>
          <Typography variant="body2">
            Statut : {formatField(trip?.status)}
          </Typography>
        </Stack>

        {(!isPassedTrip || isAdmin) &&
          !['start', 'arrived'].includes(trip?.status ?? '') && (
            <Stack
              direction={{ xs: 'row', sm: 'column' }}
              alignItems="center"
              justifyContent={'space-between'}
              width={{ xs: '100%', sm: '10%' }}
            >
              <IconButton
                aria-label="edit"
                onClick={() => tripId && onEdit(tripId)}
                sx={(theme) => ({ color: theme.palette.primary.main })}
              >
                <EditIcon />
              </IconButton>
              {trip?.status !== 'cancelled' && !isPassedTrip && (
                <IconButton
                  aria-label="cancel"
                  onClick={() => {
                    if (tripId)
                      if (isAdmin) {
                        onDelete(tripId);
                      } else {
                        handleDeleteClick(tripId);
                      }
                  }}
                  sx={(theme) => ({ color: theme.palette.error.main })}
                >
                  <DeleteForeverIcon />
                </IconButton>
              )}
            </Stack>
          )}
        {(isPassedTrip || isAdmin) &&
          !['cancelled', 'arrived'].includes(trip?.status ?? '') && (
            <Stack
              direction={{ xs: 'row', sm: 'column' }}
              alignItems="center"
              justifyContent={'space-between'}
              width={{ xs: '100%', sm: '10%' }}
            >
              {trip?.status !== 'start' && <IconButton
                aria-label="start"
                onClick={() => tripId && onStart(tripId)}
                sx={(theme) => ({ color: theme.palette.primary.main })}
              >
                <PlayCircleFilledWhiteIcon />
              </IconButton>}

              {trip?.status === 'start' && <IconButton
                aria-label="arrived"
                onClick={() => tripId && onArrived(tripId)}
                sx={(theme) => ({ color: theme.palette.primary.main })}
              >
                <FlagCircleIcon />
              </IconButton>}
            </Stack>
          )}
      </Box>

      {!isAdmin && (
        <ConfirmDialog
          open={dialogOpen}
          message={`Es-tu sûr de vouloir supprimer \
                le voyage ${trip?.departureCity} → ${trip?.arrivalCity} \
                du ${formatDateTime(trip?.departureDate)} au ${formatDateTime(trip?.arrivalDate)} ?`}
          onClose={() => setDialogOpen(false)}
          onConfirm={() => onDelete && handleConfirmDelete(onDelete)}
          isDelete={true}
        />
      )}
    </Paper>
  );
};
