import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Box,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  AccountCircle,
  LockReset,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useState, useMemo, type MouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLiveClock } from '../hooks/useLiveClock';
import TabBar from './TabBar';
import type { TabItem } from '../data/data';
import Logo from '../assets/icons/Logo.svg';

/* ----------------------- Import All Tab Sets ----------------------- */
import {
  FRONT_DESK_TABS,
  TRIAGE_TABS,
  REFRACTION_TABS,
  DOCTOR_TABS,
  DIAGNOSIS_TABS,
  DEFAULT_TABS,
  OPERATIONAL_TABS,
} from '../data/data';

/* ----------------------- Notification Panel ----------------------- */
import NotificationPanel from '../features/shared/components/NotificationPanel';

/* ----------------------- Department Mapping ----------------------- */
const DEPARTMENT_MAP: Record<string, string> = {
  '/front-desk': 'Front Desk',
  '/triage': 'Triage',
  '/refraction': 'Refraction',
  '/doctor': 'Doctor',
  '/diagnosis': 'Diagnosis',
  '/or': 'OR',
  '/default': 'Default',
};

/* ----------------------- Helper: Find Label ----------------------- */
function findLabel(tabs: TabItem[], pathname: string): string | null {
  for (const parent of tabs) {
    if (parent.path === pathname) return parent.label;
    if (parent.children) {
      for (const child of parent.children) {
        if (child.path === pathname) return child.label;
      }
    }
  }
  return null;
}

/* ----------------------- Props ----------------------- */
interface TopBarProps {
  drawerOpen: boolean;
  onToggleDrawer: () => void;
  onToggleTheme: () => void;
  darkMode: boolean;
  tabsData?: TabItem[];
}

/* ----------------------- Component ----------------------- */
export default function TopBar({
  drawerOpen,
  onToggleDrawer,
  onToggleTheme,
  darkMode,
  tabsData = [],
}: TopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const timeStr = useLiveClock('PPP – p (z)');

  /* ---------------- Settings Menu ---------------- */
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null);
  const openSettings = (e: MouseEvent<HTMLElement>) => setSettingsAnchor(e.currentTarget);
  const closeSettings = () => setSettingsAnchor(null);

  /* ---------------- Detect Department & Label ---------------- */
  const { department, currentLabel } = useMemo(() => {
    const path = location.pathname;
    let activeTabs: TabItem[] = [];
    let dept = '';

    if (path.startsWith('/front-desk')) {
      activeTabs = FRONT_DESK_TABS;
      dept = DEPARTMENT_MAP['/front-desk'];
    } else if (path.startsWith('/triage')) {
      activeTabs = TRIAGE_TABS;
      dept = DEPARTMENT_MAP['/triage'];
    } else if (path.startsWith('/refraction')) {
      activeTabs = REFRACTION_TABS;
      dept = DEPARTMENT_MAP['/refraction'];
    } else if (path.startsWith('/doctor')) {
      activeTabs = DOCTOR_TABS;
      dept = DEPARTMENT_MAP['/doctor'];
    } else if (path.startsWith('/diagnosis')) {
      activeTabs = DIAGNOSIS_TABS;
      dept = DEPARTMENT_MAP['/diagnosis'];
    } else if (path.startsWith('/or')) {
      activeTabs = OPERATIONAL_TABS;
      dept = DEPARTMENT_MAP['/or'];
    } else if (path.startsWith('/default')) {
      activeTabs = DEFAULT_TABS;
      dept = DEPARTMENT_MAP['/default'];
    }

    const label = findLabel(activeTabs, path);
    return { department: dept, currentLabel: label };
  }, [location.pathname]);

  const title = useMemo(() => {
    const parts: string[] = [];
    if (department) parts.push(department);
    // if (currentLabel) parts.push(currentLabel);
    return parts.length ? parts.join(' – ') : 'EMR System';
  }, [department, currentLabel]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onToggleDrawer}
            sx={{ mr: 1, ...(drawerOpen && { display: { md: 'none' } }) }}
          >
            <MenuIcon />
          </IconButton>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 2 }}>
            <Box
              component="img"
              src={Logo}
              alt="Logo"
              sx={{
                height: 50,
                width: 80,
                borderRadius: 1,
                objectFit: 'contain',
                bgcolor: 'background.paper',
                p: 0.5,
              }}
            />
          </Stack>

          <Typography
            variant="h6"
            noWrap
            sx={{ flexGrow: 1, cursor: 'pointer', alignSelf: 'center' }}
            onClick={() => navigate('/')}
          >
            {title} Dashboard
          </Typography>

          <Typography variant="body2" sx={{ mr: 3, display: { xs: 'none', sm: 'block' } }}>
            {timeStr}
          </Typography>

          <IconButton onClick={onToggleTheme} color="inherit" sx={{ mr: 1 }}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {/* Notifications Panel */}
          <NotificationPanel />

          {/* Settings */}
          <Tooltip title="Settings">
            <IconButton onClick={openSettings} color="inherit">
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* Profile */}
          {/* <Tooltip title={user?.name ?? ''}>
            <IconButton onClick={openSettings} color="inherit">
              <Avatar sx={{ width: 32, height: 32 }}>
                {(user?.name?.[0] ?? '').toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip> */}
        </Toolbar>

        {tabsData.length > 0 && <TabBar tabsData={tabsData} />}
      </AppBar>

      {/* ---------------- Settings Menu ---------------- */}
      <Menu anchorEl={settingsAnchor} open={Boolean(settingsAnchor)} onClose={closeSettings}>
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Account Settings
        </MenuItem>
        <MenuItem onClick={() => navigate('/change-password')}>
          <ListItemIcon>
            <LockReset fontSize="small" />
          </ListItemIcon>
          Change Password
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Box sx={{ height: tabsData.length > 0 ? '112px' : '64px' }} />
    </>
  );
}
