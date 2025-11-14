import { AppBar, Toolbar, Typography, IconButton, Avatar, Tooltip, Menu, MenuItem, Divider, ListItemIcon, useTheme, Box } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon, Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon } from '@mui/icons-material';
import { useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLiveClock } from '../hooks/useLiveClock';
import TabBar from './TabBar';
import type { TabItem } from '../data/data';


interface TopBarProps {
  drawerOpen: boolean;
  onToggleDrawer: () => void;
  onToggleTheme: () => void;
  darkMode: boolean;
  tabsData?: TabItem[];
}

export default function TopBar({ drawerOpen, onToggleDrawer, onToggleTheme, darkMode, tabsData = [] }: TopBarProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const timeStr = useLiveClock('PPP – p (z)');

  const handleProfileMenu = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <AppBar position="sticky"  sx={{ width: '100%', transition: theme.transitions.create(['margin', 'width']) }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onToggleDrawer} sx={{ mr: 2, ...(drawerOpen && { display: { md: 'none' } }) }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            EMR System {user?.name ?? ''}
          </Typography>
          <Typography variant="body2" sx={{ mr: 3, display: { xs: 'none', sm: 'block' } }}>{timeStr}</Typography>
          <IconButton color="inherit" onClick={onToggleTheme} sx={{ mr: 1 }}>{darkMode ? <LightModeIcon /> : <DarkModeIcon />}</IconButton>
          <Tooltip title={user?.name ?? ''}>
            <IconButton onClick={handleProfileMenu} color="inherit">
              <Avatar alt={user?.name} src={user?.profile_image ?? undefined} sx={{ width: 32, height: 32 }}>
                {(user?.name?.[0] ?? '').toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MenuItem disabled><Typography variant="body2">{user?.email}</Typography></MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}><ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>Logout</MenuItem>
          </Menu>
        </Toolbar>

        {/* TabBar inside AppBar */}
      </AppBar>
        {tabsData.length > 0 && <TabBar tabsData={tabsData} />}

      {/* Spacer for AppBar + TabBar */}
      <Box sx={{ height: tabsData.length > 0 ? '112px' : '64px' }} />
    </>
  );
}
