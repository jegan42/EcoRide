// frontend/src/components/header/Header.tsx
import { type JSX } from 'react';
import { AppBar, Toolbar } from '@mui/material';
import { Logo } from '../Logo';
import { HeaderNav } from './HeaderNav';

export const Header = (): JSX.Element => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: 'background.paper' }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: 'flex',
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          px: 4,
        }}
      >
        <Logo />
        <HeaderNav />
      </Toolbar>
    </AppBar>
  );
};
