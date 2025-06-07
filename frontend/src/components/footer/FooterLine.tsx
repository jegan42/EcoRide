// frontend/src/components/footer/ContactLine.tsx
import { Box, IconButton, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface ContactLineProps {
  icon: ReactNode;
  text: string;
}

export const ContactLine: React.FC<ContactLineProps> = ({ icon, text }) => (
  <Typography variant="body2">
    <Box
      component="span"
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
    >
      {icon}
      {text}
    </Box>
  </Typography>
);

interface SocialLineProps {
  icon: ReactNode;
  href: string;
  label: string;
}

export const SocialLine: React.FC<SocialLineProps> = ({
  icon,
  href,
  label,
}) => (
  <IconButton
    component="a"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    sx={{ color: 'secondary.main' }}
  >
    {icon}
  </IconButton>
);
