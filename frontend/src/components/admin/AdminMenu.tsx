// frontend/src/components/admin/AdminMenu.tsx
import React from 'react';
import { Typography, Paper, Grid, Button } from '@mui/material';
import type { AdminFormMode } from '../../types/admin';

interface Props {
  viewMode: AdminFormMode;
  setViewMode: (mode: AdminFormMode) => void;
}

export const AdminMenu: React.FC<Props> = ({ viewMode, setViewMode }) => {
  return (
    <Grid container spacing={3}>
      <Grid
        component={'div'}
        size={{ xs: 12, md: 6 }}
        onClick={() =>
          viewMode.includes('user') ? setViewMode('') : setViewMode('userList')
        }
      >
        <Button sx={{ width: '100%', p: 0.5 }}>
          <Paper
            sx={{
              width: '100%',
              p: 3,
              backgroundColor: viewMode.includes('user')
                ? 'background.default'
                : 'background.paper',
              border: viewMode.includes('user')
                ? '1px solid black'
                : 'background.paper',
            }}
          >
            <Typography variant="h6">Utilisateurs</Typography>
            <Typography variant="body2">
              Gérer les utilisateurs, leurs rôles et accès.
            </Typography>
          </Paper>
        </Button>
      </Grid>

      <Grid component={'div'} size={{ xs: 12, md: 6 }}>
        <Button
          sx={{ width: '100%', p: 0.5 }}
          onClick={() =>
            viewMode.includes('contact')
              ? setViewMode('')
              : setViewMode('contactList')
          }
        >
          <Paper
            sx={{
              width: '100%',
              p: 3,
              backgroundColor: viewMode.includes('contact')
                ? 'background.default'
                : 'background.paper',
              border: viewMode.includes('contact')
                ? '1px solid black'
                : 'background.paper',
            }}
          >
            <Typography variant="h6">Messages de contact</Typography>
            <Typography variant="body2">
              Voir les messages reçus via le formulaire de contact.
            </Typography>
          </Paper>
        </Button>
      </Grid>

      <Grid component={'div'} size={{ xs: 12, md: 6 }}>
        <Button
          sx={{ width: '100%', p: 0.5 }}
          onClick={() =>
            viewMode.includes('trip')
              ? setViewMode('')
              : setViewMode('tripList')
          }
        >
          <Paper
            sx={{
              width: '100%',
              p: 3,
              backgroundColor: viewMode.includes('trip')
                ? 'background.default'
                : 'background.paper',
              border: viewMode.includes('trip')
                ? '1px solid black'
                : 'background.paper',
            }}
          >
            <Typography variant="h6">Trajets</Typography>
            <Typography variant="body2">
              Voir, modifier ou supprimer tous les trajets.
            </Typography>
          </Paper>
        </Button>
      </Grid>

      <Grid component={'div'} size={{ xs: 12, md: 6 }}>
        <Button
          sx={{ width: '100%', p: 0.5 }}
          onClick={() =>
            viewMode.includes('stat')
              ? setViewMode('')
              : setViewMode('statList')
          }
        >
          <Paper
            sx={{
              width: '100%',
              p: 3,
              backgroundColor: viewMode.includes('stat')
                ? 'background.default'
                : 'background.paper',
              border: viewMode.includes('stat')
                ? '1px solid black'
                : 'background.paper',
            }}
          >
            <Typography variant="h6">Statistiques</Typography>
            <Typography variant="body2">
              Nombre de trajets, utilisateurs actifs, etc.
            </Typography>
          </Paper>
        </Button>
      </Grid>
    </Grid>
  );
};
