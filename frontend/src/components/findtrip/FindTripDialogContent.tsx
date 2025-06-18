// frontend/src/components/findtrip/FindTripDialogContent.tsx
import { DialogContent, TextField } from '@mui/material';
import type { Trip } from '../../types/trip';
import { TripDetails } from '../trip/TripDetails';
import type { JSX } from 'react';

export const FindTripDialogContent = ({
  trip,
  maxSeats,
  seats,
  setSeats,
}: {
  trip: Partial<Trip>;
  maxSeats: number;
  seats: number;
  setSeats: (seats: number) => void;
}): JSX.Element => {
  return (
    <>
      <TripDetails trip={trip} />
      <DialogContent>
        <TextField
          label={`Nombre de places (max. ${maxSeats})`}
          type="number"
          fullWidth
          margin="normal"
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          slotProps={{
            input: {
              inputProps: {
                min: 1,
                max: maxSeats,
              },
            },
          }}
          error={seats > maxSeats || seats < 1}
          helperText={
            seats > maxSeats
              ? `Vous ne pouvez réserver plus de ${maxSeats} place${maxSeats > 1 ? 's' : ''}.`
              : seats < 1
                ? 'Au moins une place doit être réservée.'
                : ''
          }
        />
      </DialogContent>
    </>
  );
};
