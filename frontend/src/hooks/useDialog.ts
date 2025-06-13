// frontend/src/hooks/useDialog.tsx
import { useState } from 'react';

export const useDialog = (): {
  dialogOpen: boolean;
  setDialogOpen: (dialogOpen: boolean) => void;
  handleDeleteClick: (id: string) => void;
  handleConfirmDelete: (onDelete: (id: string) => void) => void;
} => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeleteClick = (id: string): void => {
    setSelectedId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = (onDelete: (id: string) => void): void => {
    if (selectedId) {
      onDelete(selectedId);
    }
    setDialogOpen(false);
    setSelectedId(null);
  };

  return {
    dialogOpen,
    setDialogOpen,
    handleDeleteClick,
    handleConfirmDelete,
  };
};
