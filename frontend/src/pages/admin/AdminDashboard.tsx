// frontend/src/pages/admin/AdminDashboard.tsx
import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useAppSelector } from '../../hooks/useAppSelector';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import type { User } from '../../types/user';
import { AdminMenu } from '../../components/admin/AdminMenu';
import { AdminSwitchViewList } from '../../components/admin/AdminSwitchViewList';
import { ConfirmDialog } from '../../components/dailog/ConfirmDialog';
import type { AdminFormMode } from '../../types/admin';
import type { Trip } from '../../types/trip';
import type { Contact } from '../../types/contact';
import { AdminDialogContent } from '../../components/admin/AdminDialogContent';

const getDialogTitle = (viewMode: AdminFormMode): string => {
  if (viewMode.includes('userEdit')) return 'Modification d’un utilisateur';
  if (viewMode.includes('contactEdit')) return 'Répondre au message';
  if (viewMode.includes('contactDelete')) return 'Ne pas répondre au message';
  if (viewMode.includes('tripStart')) return 'Démarrage du voyage';
  if (viewMode.includes('tripArrived')) return 'Fin du voyage';
  if (viewMode.includes('reviewEdit')) return 'Valider ou refuser un avis';
  return '';
};

export const AdminDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const {
    viewMode,
    setViewMode,
    submitting,
    handleClose,
    handleConfirm,
    selectedData,
    setSelectedData,
    dataToUpdate,
    setDataToUpdate,
    loading,
  } = useAdmin();

  const isAdmin = user?.role?.includes('admin') ?? false;
  const isEmployee = user?.role?.includes('employee') ?? false;

  if (!(user && (isAdmin || isEmployee))) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box component="main" sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Tableau de bord administrateur
        </Typography>

        <AdminMenu
          viewMode={viewMode}
          setViewMode={setViewMode}
          isAdmin={isAdmin}
        />

        {loading && <Typography>Chargement...</Typography>}

        <AdminSwitchViewList
          viewMode={viewMode}
          setViewMode={setViewMode}
          setSelectedData={setSelectedData}
        />
      </Container>

      {selectedData && (
        <ConfirmDialog
          title={getDialogTitle(viewMode)}
          open={!!selectedData}
          submitting={submitting}
          onClose={handleClose}
          onConfirm={() =>
            handleConfirm(viewMode, dataToUpdate as User | Trip | Contact)
          }
          confirmName={
            viewMode.includes('contactEdit') ? 'Répondre' : undefined
          }
        >
          <AdminDialogContent
            viewMode={viewMode}
            selectedData={selectedData}
            setDataToUpdate={setDataToUpdate}
          />
        </ConfirmDialog>
      )}
    </Box>
  );
};
