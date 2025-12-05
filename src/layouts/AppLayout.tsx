import { Box, CssBaseline, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import TopBar from './TopBar';
import type { TabItem } from '../data/data';
import { Outlet } from 'react-router-dom';
import { Suspense, useState } from 'react';

interface Props {
  tabsData?: TabItem[];
  darkMode: boolean;
  onToggleTheme: () => void;
  currentPath?: string;
}

export default function AppLayout({ tabsData = [], darkMode, onToggleTheme, currentPath }: Props) {
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
      <Box component="main">
        <Suspense fallback={<CircularProgress />}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  );
}
