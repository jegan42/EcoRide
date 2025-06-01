// frontend/src/components/Header.tsx
import { type JSX, useState, useRef } from 'react';
import { signout as signoutAction } from '../store/slices/authSlice';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Stack,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ecorideLogo from '../assets/ecoride_logo.png';
import { useDispatch } from 'react-redux';
import authService from '../services/authService';
import { enqueueSnackbarSuccess } from '../utils/enqueueSnackbar';

const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Proposer trajet', to: '/createtrip' },
  { label: 'Trouver trajet', to: '/findtrip' },
  { label: 'Historique', to: '/history' },
  { label: 'À propos', to: '/about' },
  { label: 'Profil', to: '/profile' },
];

const Header = (): JSX.Element => {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const logoutButtonRef = useRef<HTMLButtonElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const signoutSubmit = async (): Promise<void> => {
    const { message, data: _ } = await authService.signout();
    dispatch(signoutAction());
    enqueueSnackbarSuccess(message);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: 'background.paper' }}
    >
      <Toolbar
        disableGutters
        sx={{
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          px: 4,
        }}
      >
        \
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h6"
            sx={{ color: 'primary.main', fontWeight: 700 }}
          >
            EcoRide
          </Typography>
          <Box
            component="img"
            src={ecorideLogo}
            alt="EcoRide Logo"
            sx={{ height: { xs: 30, md: 40 } }}
          />
        </Box>
        {isMobile ? (
          <>
            <IconButton
              aria-label="menu"
              edge="end"
              onClick={() => setDrawerOpen(true)}
              sx={{ color: theme.palette.primary.main }}
            >
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <Box sx={{ width: 250, p: 2 }}>
                <List>
                  {navLinks.map((link) => (
                    <ListItem
                      key={link.to}
                      component={Link}
                      to={link.to}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <ListItemText primary={link.label} />
                    </ListItem>
                  ))}
                  <ListItem>
                    <Button
                      ref={logoutButtonRef}
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Déconnexion
                    </Button>
                  </ListItem>
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Stack direction="row" spacing={3} alignItems="center">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  textDecoration: 'none',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.primary',
                    borderBottom: '2px solid transparent',
                    '&:hover': {
                      borderBottomColor: 'text.primary',
                    },
                  }}
                >
                  {link.label}
                </Typography>
              </Link>
            ))}
            <Button
              ref={logoutButtonRef}
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2, textTransform: 'none' }}
              onClick={signoutSubmit}
            >
              Déconnexion
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
