// frontend/src/pages/Home.tsx
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/bg-home.jpg';
import img1 from '../assets/illustration-1.webp';
import img2 from '../assets/illustration-2.webp';
import { FindTripSearch } from '../components/findtrip/FindTripSearch';
import { useAverageRating } from '../hooks/useAverageRating';
import { useFindTripFilters } from '../hooks/useFindTripFilters';
import { useTrip } from '../hooks/useTrip';
import type { Trip } from '../types/trip';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { allTrips, fetchTrips } = useTrip();

  const safeTrips = allTrips.filter(
    (v): v is Trip =>
      !!v?.id && new Date(v.departureDate).getTime() > new Date().getTime()
  );

  const { enrichedTrips } = useAverageRating(safeTrips);

  const { departureCities, arrivalCities } = useFindTripFilters(enrichedTrips);

  return (
    <Box component="main">
      <Box
        component="header"
        sx={{
          height: '40vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2,
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="primary.dark">
            Le covoiturage éco-responsable pour tous
          </Typography>

          <Button variant="contained" onClick={() => navigate('/findtrip')}>
            Rechercher un itinéraire
          </Button>
        </Box>
      </Box>

      <Box
        component="section"
        p={4}
        sx={{ backgroundColor: 'background.paper' }}
      >
        <Box width={{ xs: '100%', sm: '80%' }} mx={'auto'}>
          <Grid container spacing={4} alignItems="center">
            <Grid component={'div'} size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" gutterBottom>
                🌱 EcoRide,
                <br />
                le covoiturage écoresponsable
              </Typography>
              <Typography variant="body1">
                EcoRide est une startup française qui s’engage pour la planète
                en facilitant les trajets partagés en voiture. Son objectif :
                réduire les émissions de CO₂ tout en proposant une solution
                économique et conviviale.
              </Typography>
            </Grid>
            <Grid component={'div'} size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src={img1}
                alt="Illustration flexibilité des trajets"
                sx={{ width: '100%', borderRadius: 2 }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box component="section" p={4}>
        <Box width={{ xs: '100%', sm: '80%' }} mx={'auto'}>
          <Grid container spacing={4} alignItems="center">
            <Grid component={'div'} size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src={img2}
                alt="Illustration communauté"
                sx={{ width: '100%', borderRadius: 2 }}
              />
            </Grid>
            <Grid component={'div'} size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" gutterBottom>
                🚗 Une plateforme pour mieux voyager
              </Typography>
              <Typography variant="body1">
                Via son application web, EcoRide met en relation conducteurs et
                passagers, avec une priorité donnée aux véhicules électriques.
                Un outil simple, pensé pour les voyageurs soucieux de
                l’environnement.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box
        component="section"
        p={4}
        sx={{ backgroundColor: 'background.paper' }}
      >
        <Box width={{ xs: '100%', sm: '80%' }} mx={'auto'}>
          <Typography variant="h5" mb={2} textAlign={'center'}>
            Rechercher un trajet rapidement
          </Typography>
          <FindTripSearch
            fetchTrips={fetchTrips}
            availableDepartureCities={departureCities}
            availableArrivalCities={arrivalCities}
            isHome={true}
          />
        </Box>
      </Box>

      <Box component="section" p={4}>
        <Box width={{ xs: '100%', sm: '80%' }} mx={'auto'}>
          <Typography variant="h5" textAlign="center" mb={3}>
            Pourquoi nous choisir ?
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {[
              { title: '⚡ Rapide', text: 'Gain de temps' },
              { title: '💶 Économique', text: 'Frais partagés' },
              { title: '🌱 Écologique', text: 'Moins de CO₂' },
              { title: '🛡️ Sécurisé', text: 'Avis vérifiés' },
              { title: '📅 Flexible', text: 'Trajets variés' },
            ].map((item, index) => (
              <Grid
                component={'div'}
                size={{ xs: 6, sm: 4, md: 2.4 }}
                key={index}
              >
                <Paper
                  elevation={3}
                  sx={{
                    padding: 2,
                    textAlign: 'center',
                    borderRadius: 3,
                    height: '100%',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.text}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};
