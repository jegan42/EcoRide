// frontend/src/components/sidebar/SidebarBase.tsx
import React, { useState } from 'react';
import { Box, Drawer, IconButton } from '@mui/material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { drawerWidth } from './Sidebar';

interface Props {
  sidebarContent: React.ReactNode;
}

export const SidebarBase: React.FC<Props> = ({ sidebarContent }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: { xs: mobileOpen ? drawerWidth : 0, sm: drawerWidth },
      }}
      aria-label="SidebarBase-Container"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={(theme) => ({
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            p: 2,
            bgcolor: theme.palette.secondary.contrastText,
            color: theme.palette.primary.contrastText,
          },
        })}
        aria-label="drawer sidebar"
      >
        {sidebarContent}
      </Drawer>

      <Box
        sx={(theme) => ({
          display: { xs: 'none', sm: 'flex' },
          width: drawerWidth,
          flexShrink: 0,
          flexDirection: 'column',
          bgcolor: theme.palette.secondary.contrastText,
          color: theme.palette.primary.contrastText,
          height: '100%',
          p: 2,
        })}
        aria-label="sidebar"
      >
        {sidebarContent}
      </Box>
      <IconButton
        color="inherit"
        onClick={handleDrawerToggle}
        sx={{
          display: { sm: 'none' },
          position: 'fixed',
          top: 64,
          left: 8,
          zIndex: 1300,
          bgcolor: 'background.paper',
        }}
        aria-label="open sidebar"
      >
        <KeyboardDoubleArrowRightIcon />
      </IconButton>
    </Box>
  );
};
