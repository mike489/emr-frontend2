import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import TopBar from './TopBar';
import type { TabItem } from '../data/data';
import { useState } from 'react';

interface Props {
  children: React.ReactNode;
  tabsData?: TabItem[];
  darkMode: boolean;               
  onToggleTheme: () => void;       
}

export default function AppLayout({ children, tabsData = [], darkMode, onToggleTheme }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);

  const toggleDrawer = () => setDrawerOpen((v: any) => !v);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />

      {/* TopBar */}
      <TopBar
        drawerOpen={drawerOpen}
        onToggleDrawer={toggleDrawer}
        darkMode={darkMode}
        onToggleTheme={onToggleTheme}
        tabsData={tabsData}
      />

      {/* Main Content */}
      <Box component="main" sx={{}}>
        {children}
      </Box>
    </Box>
  );
}
