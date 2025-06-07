// frontend/src/components/footer/FooterInfo.tsx
import { Box, Stack, Typography } from '@mui/material';
import type { JSX } from 'react';
import { contactInfo, socialInfo } from './FooterList';
import { ContactLine, SocialLine } from './FooterLine';

export const FooterInfo: React.FC = (): JSX.Element => {
  return (
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
      {contactInfo.map((item, index) => (
        <ContactLine key={index} icon={item.icon} text={item.text} />
      ))}
      <Box
        component="span"
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}
      >
        <Typography variant="body2">Suivez-nous</Typography>
        <Stack direction="row" spacing={1}>
          {socialInfo.map((item, index) => (
            <SocialLine
              key={index}
              icon={item.icon}
              href={item.href}
              label={item.label}
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};
