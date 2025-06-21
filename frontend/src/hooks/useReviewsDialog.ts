// frontend/src/hooks/useReviewDialog.tsx
import { useState } from 'react';

export const useReviewDialog = (): {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  setOpen: (open: boolean) => void;
} => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  return {
    open,
    setOpen,
    handleOpen,
    handleClose,
  };
};
