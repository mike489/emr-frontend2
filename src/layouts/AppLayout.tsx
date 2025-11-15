import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import TopBar from './TopBar';
import type { TabItem } from '../data/data';

interface Props {
  children: React.ReactNode;
  tabsData?: TabItem[]; 
}

export default function AppLayout({ children, tabsData = [] }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDrawer = () => setDrawerOpen((v) => !v);
  const toggleTheme = () => setDarkMode((v) => !v);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', }}>
      <CssBaseline />

      {/* TopBar */}
      <TopBar
        drawerOpen={drawerOpen}
        onToggleDrawer={toggleDrawer}
        onToggleTheme={toggleTheme}
        darkMode={darkMode}
        tabsData={tabsData} // pass to TopBar if you want TabBar inside TopBar
      />

      {/* TabBar (below TopBar) */}
     

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          // flexGrow: 1,
          // pt: 5.4,
         
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
