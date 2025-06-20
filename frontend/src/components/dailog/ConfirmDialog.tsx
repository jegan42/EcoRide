// frontend/src/components/dialog/ConfirmDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface ConfirmDialogProps {
  title?: string;
  open: boolean;
  submitting?: boolean;
  message?: string;
  children?: React.ReactElement | React.ReactElement[] | null;
  onClose: () => void;
  onConfirm: () => void;
  isDelete?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disabledConfirm?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title = 'Confirmation',
  open,
  submitting = false,
  message = '',
  children = null,
  onClose,
  onConfirm,
  isDelete = false,
  maxWidth = 'sm',
  disabledConfirm = false,
}) => {
  const buttonColor = isDelete ? 'error' : 'primary';
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {message && <Typography>{message}</Typography>}
        {children}
      </DialogContent>
      <DialogActions>
        <Button aria-label="cancel" onClick={onClose} disabled={submitting}>
          Annuler
        </Button>
        <Button
          aria-label="confirm"
          onClick={onConfirm}
          color={buttonColor}
          variant="contained"
          disabled={submitting || disabledConfirm}
          autoFocus
        >
          {submitting ? 'Chargement...' : 'Confirmer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
