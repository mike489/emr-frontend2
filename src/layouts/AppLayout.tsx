import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import TopBar from './TopBar';
import { usePreventBackToPublic } from '../hooks/usePreventBackToPublic';

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [darkMode, setDarkMode] = useState(false);
  usePreventBackToPublic();
  const toggleDrawer = () => setDrawerOpen(v => !v);
  const toggleTheme = () => setDarkMode(v => !v);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar
        drawerOpen={drawerOpen}
        onToggleDrawer={toggleDrawer}
        onToggleTheme={toggleTheme}
        darkMode={darkMode}
      />
      {/* <SideBar open={drawerOpen} onClose={toggleDrawer} /> */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // p: 3,
          // mt: { xs: 7, md: 8 },
          pt:5.4,
          width: { md: '100%' },
          ml: 0,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
