// frontend/src/components/review/ReviewForm.tsx
import { Box, TextField, Typography, Rating } from '@mui/material';
import type { JSX } from 'react';

interface Props {
  rating: number;
  setRating: (rate: number) => void;
  comment: string;
  setComment: (comment: string) => void;
}

export const ReviewForm = ({
  rating,
  setRating,
  comment,
  setComment,
}: Props): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={2} mt={2}>
      <Typography variant="h6" component="h2">
        Laisser un avis
      </Typography>

      <Rating
        name="rating"
        value={rating}
        onChange={(_, newValue) => setRating(Number(newValue))}
        precision={1}
      />

      <TextField
        label="Commentaire"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        multiline
        rows={3}
        variant="outlined"
        fullWidth
        slotProps={{
          input: {
            inputProps: { maxLength: 500 },
          },
        }}
      />
    </Box>
  );
};
