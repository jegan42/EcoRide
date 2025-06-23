// frontend/src/pages/About.tsx
import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import img1 from '../assets/illustration-1.webp';
import img2 from '../assets/illustration-2.webp';

export const About: React.FC = () => {
  return (
    <Box component="main" sx={{ py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          À propos de EcoRide
        </Typography>

        <Typography variant="body1">
          <strong>EcoRide</strong> est une startup française fondée en 2025, née
          d’une volonté claire : rendre le covoiturage plus écologique,
          accessible et solidaire. Nous croyons qu’un avenir durable passe par
          une mobilité partagée, intelligente et respectueuse de
          l’environnement.
        </Typography>

        <Typography variant="body1">
          Grâce à notre plateforme, nous connectons des conducteurs et des
          passagers partageant les mêmes trajets, en mettant l'accent sur
          l'utilisation de véhicules électriques et les bonnes pratiques de
          conduite.
        </Typography>

        <Box sx={{ my: 4 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid component={'div'} size={{ xs: 12, md: 6 }}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Nos valeurs
                </Typography>
                <Typography variant="body2">
                  🌍 Écologie : réduire les émissions de CO₂.
                </Typography>
                <Typography variant="body2">
                  🤝 Communauté : favoriser l’entraide et les échanges entre
                  voyageurs.
                </Typography>
                <Typography variant="body2">
                  🔐 Sécurité : des avis vérifiés et des profils authentifiés.
                </Typography>
              </Paper>
            </Grid>
            <Grid component={'div'} size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src={img1}
                alt="Valeurs EcoRide"
                sx={{ width: '100%', borderRadius: 2 }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ my: 4 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid component={'div'} size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src={img2}
                alt="Communauté"
                sx={{ width: '100%', borderRadius: 2 }}
              />
            </Grid>
            <Grid component={'div'} size={{ xs: 12, md: 6 }}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Une équipe engagée
                </Typography>
                <Typography variant="body2">
                  Nous sommes une équipe passionnée de développeurs, designers
                  et experts en mobilité durable. Chaque ligne de code est
                  pensée pour rendre l'expérience plus fluide, plus humaine, et
                  plus respectueuse de notre planète.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="body1" mt={4}>
          Rejoignez la communauté EcoRide et devenez acteur du changement dès
          aujourd’hui.
        </Typography>
      </Container>
    </Box>
  );
};
