// components/dialog/ConfirmDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = 'Confirmation',
  message,
  onCancel,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button aria-label="cancel" onClick={onCancel} color="inherit">
          Annuler
        </Button>
        <Button
          aria-label="confirm"
          onClick={onConfirm}
          color="error"
          variant="contained"
        >
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};
