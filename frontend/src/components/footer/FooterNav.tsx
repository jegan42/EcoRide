// frontend/src/components/footer/FooterNav.tsx
import { Stack, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const navLinks = [
  { href: '/notices', label: 'Mentions légales' },
  { href: '/about', label: 'A propos' },
  { href: '/contact', label: 'Contact' },
];

export const FooterNav: React.FC = () => {
  return (
    <Stack
      spacing={0.5}
      sx={{
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: { xs: 'center', md: 'right' },
        flexShrink: 0,
        mt: { xs: 2, md: 0 },
        order: { xs: 3, md: 3 },
      }}
    >
      {navLinks.map((item, index) => (
        <Link
          key={index}
          component={RouterLink}
          to={item.href}
          underline="none"
          sx={{
            fontWeight: 'medium',
            color: 'primary.main',
            '&:hover': { opacity: 0.8 },
          }}
        >
          {item.label}
        </Link>
      ))}
      <Typography variant="body2" sx={{ mt: 1 }}>
        © 2025 EcoRide.
      </Typography>
    </Stack>
  );
};
