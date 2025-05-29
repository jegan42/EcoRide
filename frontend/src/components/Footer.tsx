// frontend/src/components/Footer.tsx
import type { JSX } from 'react';
import { Box, Typography, Stack, Link, IconButton } from '@mui/material';
import ecorideLogo from '../assets/ecoride_logo.png';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MailIcon from '@mui/icons-material/Mail';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = (): JSX.Element => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        color: 'primary.main',
        px: { xs: 2, md: 5 },
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 15 },
      }}
    >
      <Stack
        direction="column"
        alignItems="center"
        spacing={0.5}
        sx={{
          fontWeight: 'bold',
          fontSize: '1.5rem',
          flexShrink: 0,
          order: { xs: 1, md: 2 },
        }}
      >
        <Box
          component="img"
          src={ecorideLogo}
          alt="EcoRide Logo"
          sx={{ height: 62 }}
        />
        <Typography component="span" variant="h6" sx={{ fontWeight: 'bold' }}>
          EcoRide
        </Typography>
      </Stack>

      <Stack
        direction="column"
        spacing={0.5}
        sx={{
          justifyContent: 'center',
          textAlign: { xs: 'center', md: 'left' },
          color: 'primary.main',
          fontWeight: 'medium',
          flex: 1,
          maxWidth: 320,
          mt: { xs: 2, md: 0 },
          order: { xs: 2, md: 1 },
        }}
      >
        {/* Additional info */}
        <Typography variant="body2">
          <Box
            component="span"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
          >
            <LocationOnIcon
              aria-label="LocationOn"
              sx={{ fontSize: 20, color: 'secondary.main' }}
            />
            1 avenue Nature, 12 345 Eco-Town, France
          </Box>
        </Typography>
        <Typography variant="body2">
          <Box
            component="span"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
          >
            <LocalPhoneIcon
              aria-label="LocalPhone"
              sx={{ fontSize: 20, color: 'secondary.main' }}
            />
            (123) 456-7890
          </Box>
        </Typography>
        <Typography variant="body2">
          <Box
            component="span"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
          >
            <MailIcon
              aria-label="Mail"
              sx={{ fontSize: 20, color: 'secondary.main' }}
            />
            contact@ecoride.fr
          </Box>
        </Typography>
        <Box
          component="span"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}
        >
          <Typography variant="body2">Suivez-nous</Typography>
          <Stack direction="row" spacing={1}>
            <IconButton
              component="a"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              sx={{ color: 'secondary.main' }}
            >
              <FacebookIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              component="a"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              sx={{ color: 'secondary.main' }}
            >
              <TwitterIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              component="a"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              sx={{ color: 'secondary.main' }}
            >
              <LinkedInIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              component="a"
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              sx={{ color: 'secondary.main' }}
            >
              <YouTubeIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              component="a"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              sx={{ color: 'secondary.main' }}
            >
              <InstagramIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Stack>
        </Box>
      </Stack>

      {/* Footer Nav */}
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
        <Link
          href="/notices"
          underline="none"
          sx={{
            fontWeight: 'medium',
            color: 'primary.main',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Mentions légales
        </Link>
        <Link
          href="/about"
          underline="none"
          sx={{
            fontWeight: 'medium',
            color: 'primary.main',
            '&:hover': { opacity: 0.8 },
          }}
        >
          A propos
        </Link>
        <Link
          href="/contact"
          underline="none"
          sx={{
            fontWeight: 'medium',
            color: 'primary.main',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Contact
        </Link>
        <Typography variant="body2" sx={{ mt: 1 }}>
          © 2025 EcoRide.
        </Typography>
      </Stack>
    </Box>
  );
};

export default Footer;
