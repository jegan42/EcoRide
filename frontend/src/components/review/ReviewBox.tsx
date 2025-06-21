// frontend/src/component/profile/ReviewBox.tsx
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useReview } from '../../hooks/useReview';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatField } from '../../utils/formatField';
import { ConfirmDialog } from '../dailog/ConfirmDialog';
import { useReviewDialog } from '../../hooks/useReviewsDialog';
import { ReviewList } from './ReviewList';

interface Props {
  driverId?: string;
  reviewCount?: number;
}

export const ReviewBox: React.FC<Props> = ({ driverId, reviewCount }) => {
  const { reviews } = useReview(driverId);
  const { open, handleOpen, handleClose } = useReviewDialog();

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
      })}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="subtitle2" fontWeight={700}>
            Avis
          </Typography>
          <Typography
            variant="subtitle2"
            sx={(theme) => ({
              borderRadius: 1,
              backgroundColor: theme.palette.primary.light,
              textAlign: 'center',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              py: 0.5,
              width: '3rem',
            })}
          >
            {formatField(reviewCount)}
          </Typography>
        </Stack>
        <Button
          variant="outlined"
          color="primary"
          sx={(theme) => ({
            fontSize: '0.85rem',
            p: 0.5,
            border: 'none',
            backgroundColor: theme.palette.background.paper,
          })}
          onClick={handleOpen}
        >
          Tout voir
          <ExpandMoreIcon />
        </Button>
      </Box>
      <ReviewList reviews={reviews.slice(0, 2)} />

      <ConfirmDialog
        title="Les Avis"
        open={open}
        onClose={handleClose}
        closeName="Fermer"
      >
        <ReviewList reviews={reviews} />
      </ConfirmDialog>
    </Paper>
  );
};
