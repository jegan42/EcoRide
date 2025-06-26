// frontend/src/component/findtrip/FindTripInfoTrip.tsx
import { Box, Stack, Typography } from '@mui/material';
import type { Trip } from '../../types/trip';
import { formatDateTime } from '../../utils/formatDateTime';
import { formatField } from '../../utils/formatField';
import voyage from '../../assets/voyage.jpg';
import EuroIcon from '@mui/icons-material/Euro';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChairIcon from '@mui/icons-material/Chair';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { TripInfoRow } from './TripInfoRow';
import { formatMinutesToHours } from '../../utils/formatMinutesToHours';
import { useIsMobile } from '../../hooks/useIsMobile';

interface Props {
  trip?: Trip;
  allInfo?: boolean;
  minInfo?: boolean;
}

export const FindTripInfoTrip: React.FC<Props> = ({
  trip,
  allInfo = false,
  minInfo = false,
}) => {
  const isMobile = useIsMobile();
  const stackDirection = allInfo ? 'row' : 'column';
  const stackWidth = allInfo ? '50%' : '100%';
  const departureCity =
    allInfo && !isMobile
      ? formatField(trip?.departureCity)
      : `${formatField(trip?.departureCity).slice(0, 6)}.`;
  const arrivalCity =
    allInfo && !isMobile
      ? formatField(trip?.arrivalCity)
      : `${formatField(trip?.arrivalCity).slice(0, 6)}.`;
  return (
    <>
      <Stack
        spacing={2}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: stackDirection },
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {allInfo && (
          <Box
            component="img"
            src={voyage}
            alt="Photo du voyage"
            sx={{
              maxWidth: '100%',
              maxHeight: 150,
              objectFit: 'contain',
              borderRadius: 2,
            }}
          />
        )}

        <Stack
          direction={'column'}
          spacing={2}
          sx={{ width: { xs: '80%', sm: stackWidth } }}
        >
          {!minInfo && (
            <TripInfoRow
              icon={
                <EuroIcon
                  sx={(theme) => ({ color: theme.palette.primary.dark })}
                />
              }
              label="Prix :"
              value={<strong>{`${formatField(trip?.price)} €`}</strong>}
            />
          )}

          <TripInfoRow
            icon={
              <LocationOnIcon
                sx={(theme) => ({ color: theme.palette.primary.dark })}
              />
            }
            label="Trajet :"
            value={<strong>{`${departureCity} → ${arrivalCity}`}</strong>}
          />

          <Stack>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <CalendarMonthIcon
                sx={(theme) => ({ color: theme.palette.primary.dark })}
              />
              <Typography variant="subtitle2" fontWeight={700}>
                Date & Heure
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ ml: 3.5 }}
            >
              <Typography variant="subtitle2">Départ :</Typography>
              <Typography variant="body2">
                {formatDateTime(trip?.departureDate)}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ ml: 3.5 }}
            >
              <Typography variant="subtitle2">Arrivée :</Typography>
              <Typography variant="body2">
                {formatDateTime(trip?.arrivalDate)}
              </Typography>
            </Stack>
          </Stack>

          {(
            <TripInfoRow
              icon={
                <AccessTimeIcon
                  sx={(theme) => ({ color: theme.palette.primary.dark })}
                />
              }
              label="Durée :"
              value={formatField(
                formatMinutesToHours(Number(trip?.duration))
              )}
            />
          )}

          {!minInfo && (
            <TripInfoRow
              icon={
                <ChairIcon
                  sx={(theme) => ({ color: theme.palette.primary.dark })}
                />
              }
              label="Places dispo :"
              value={formatField(trip?.availableSeats)}
            />
          )}
        </Stack>
      </Stack>
    </>
  );
};
