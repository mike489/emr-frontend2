import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { type MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLiveClock } from '../hooks/useLiveClock';

const DRAWER_WIDTH = 260;

interface TopBarProps {
  drawerOpen: boolean;
  onToggleDrawer: () => void;
  onToggleTheme: () => void;
  darkMode: boolean;
}

export default function TopBar({
  drawerOpen,
  onToggleDrawer,
  onToggleTheme,
  darkMode,
}: TopBarProps) {
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const timeStr = useLiveClock('PPP – p (z)');

  const handleProfileMenu = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: '100%' },
        ml: { md: drawerOpen ? `${DRAWER_WIDTH}px` : 0 },
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar>
        {/* Hamburger */}
        <IconButton
          edge="start"
          color="inherit"
          onClick={onToggleDrawer}
          sx={{ mr: 2, ...(drawerOpen && { display: { md: 'none' } }) }}
        >
          <MenuIcon />
        </IconButton>

        {/* Title */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          EMR System
        </Typography>

        {/* Clock */}
        <Typography variant="body2" sx={{ mr: 3, display: { xs: 'none', sm: 'block' } }}>
          {timeStr}
        </Typography>

        {/* Dark Mode */}
        <IconButton color="inherit" onClick={onToggleTheme} sx={{ mr: 1 }}>
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        {/* Avatar + Menu */}
        <Tooltip title={user?.name ?? ''}>
          <IconButton onClick={handleProfileMenu} color="inherit">
            <Avatar
              alt={user?.name}
              src={user?.profile_image ?? undefined}
              sx={{ width: 32, height: 32 }}
            >
              {(user?.name?.[0] ?? '').toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem disabled>
            <Typography variant="body2">{user?.email}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
