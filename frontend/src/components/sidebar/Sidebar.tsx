// frontend/src/components/sidebar/Sidebar.tsx
import React from 'react';
import { Box } from '@mui/material';
import { SidebarBase } from './SidebarBase';

interface Props {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
}

export const drawerWidth = 280;

export const Sidebar: React.FC<Props> = ({ children, sidebarContent }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100vw',
        minHeight: '100vh',
        position: 'relative',
      }}
      aria-label="SideContainer"
    >
      <SidebarBase sidebarContent={sidebarContent} />
      <Box
        sx={{
          width: '100%',
          mt: 2,
          ml: { xs: 0, sm: `${drawerWidth}px` },
          p: 2,
        }}
      >
        <Box
          sx={{
            mx: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
