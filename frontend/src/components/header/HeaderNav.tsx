// frontend/src/components/header/HeaderNav.tsx
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useRef, useState, type JSX } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch } from 'react-redux';
import authService from '../../services/authService';
import { signout as signoutAction } from '../../store/slices/authSlice';
import { enqueueSnackbarSuccess } from '../../utils/enqueueSnackbar';
import { HeaderLogButton } from './HeaderLogButton';
import { useAppSelector } from '../../hooks/useAppSelector';

export const HeaderNav = (): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const logoutButtonRef = useRef<HTMLButtonElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const signoutSubmit = async (): Promise<void> => {
    try {
      const { message, data: _ } = await authService.signout();
      await authService.logoutFirebase();
      dispatch(signoutAction());
      enqueueSnackbarSuccess(message);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isAdmin = user && user.role.includes('admin');
  const navLinks = [
    { label: 'Accueil', to: '/' },
    { label: 'Trouver trajet', to: '/findtrip' },
    { label: 'À propos', to: '/about' },
    ...(isAuthenticated
      ? [{ label: 'Tableau de board', to: '/dashboard' }]
      : []),
    ...(isAdmin ? [{ label: 'Administration', to: '/admin' }] : []),
  ];
  if (isMobile) {
    return (
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
                <HeaderLogButton
                  logoutButtonRef={logoutButtonRef}
                  loginButtonRef={loginButtonRef}
                  onSignoutSubmit={signoutSubmit}
                />
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </>
    );
  } else {
    return (
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

        <HeaderLogButton
          logoutButtonRef={logoutButtonRef}
          loginButtonRef={loginButtonRef}
          onSignoutSubmit={signoutSubmit}
        />
      </Stack>
    );
  }
};
