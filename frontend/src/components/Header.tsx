// Ce composant affiche un en-tête simple avec le nom de l'application
import { Box, Typography } from '@mui/material';

const Header = () => {
  return (
    <Box
      component="header"
      sx={{
        backgroundColor: 'background.default', // ou ta couleur personnalisée
        padding: '1rem',
      }}
    >
      <Typography variant="h1">Mon App Frontend</Typography>
    </Box>
  );
};

export default Header;
