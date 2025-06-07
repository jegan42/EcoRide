// frontend/src/components/footer/FooterList.tsx
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MailIcon from '@mui/icons-material/Mail';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';

export const contactInfo = [
  {
    icon: <LocationOnIcon sx={{ fontSize: 20, color: 'secondary.main' }} />,
    text: '1 avenue Nature, 12 345 Eco-Town, France',
  },
  {
    icon: <LocalPhoneIcon sx={{ fontSize: 20, color: 'secondary.main' }} />,
    text: '(123) 456-7890',
  },
  {
    icon: <MailIcon sx={{ fontSize: 20, color: 'secondary.main' }} />,
    text: 'contact@ecoride.fr',
  },
];

export const socialInfo = [
  {
    href: 'https://facebook.com',
    label: 'Facebook',
    icon: <FacebookIcon sx={{ fontSize: 20 }} />,
  },
  {
    href: 'https://twitter.com',
    label: 'Twitter',
    icon: <TwitterIcon sx={{ fontSize: 20 }} />,
  },
  {
    href: 'https://linkedin.com',
    label: 'LinkedIn',
    icon: <LinkedInIcon sx={{ fontSize: 20 }} />,
  },
  {
    href: 'https://youtube.com',
    label: 'YouTube',
    icon: <YouTubeIcon sx={{ fontSize: 20 }} />,
  },
  {
    href: 'https://instagram.com',
    label: 'Instagram',
    icon: <InstagramIcon sx={{ fontSize: 20 }} />,
  },
];
