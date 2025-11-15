/*  components/TopBar.tsx  */
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
  Box,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useState, type MouseEvent, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLiveClock } from '../hooks/useLiveClock';
import TabBar from './TabBar';
import type { TabItem } from '../data/data';
import Logo from '../assets/icons/logo.svg';

/* ----------------------- Import All Tab Sets ----------------------- */
import {
  FRONT_DESK_TABS,
  TRIAGE_TABS,
  REFRACTION_TABS,
  DOCTOR_TABS,
  DIAGNOSIS_TABS,
  DEFAULT_TABS,
} from '../data/data';

/* ----------------------- Department Mapping ----------------------- */
const DEPARTMENT_MAP: Record<string, string> = {
  '/front-desk': 'Front Desk',
  '/triage': 'Triage',
  '/refraction': 'Refraction',
  '/doctor': 'Doctor',
  '/diagnosis': 'Diagnosis',
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
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const timeStr = useLiveClock('PPP – p (z)');

  const handleProfileMenu = (e: MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /* ----------------------- Detect Department & Label ----------------------- */
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
    } else if (path.startsWith('/default')) {
      activeTabs = DEFAULT_TABS;
      dept = DEPARTMENT_MAP['/default'];
    }

    const label = findLabel(activeTabs, path);
    return { department: dept, currentLabel: label };
  }, [location.pathname]);

  /* ----------------------- Build Title ----------------------- */
  const title = useMemo(() => {
    const parts: string[] = [];
    if (department) parts.push(department);
    if (currentLabel) parts.push(currentLabel);
    return parts.length ? parts.join(' – ') : 'EMR System';
  }, [department, currentLabel]);

  /* ----------------------- Render ----------------------- */
  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          width: '100%',
          transition: theme.transitions.create(['margin', 'width']),
        }}
      >
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
              alt="EMR System Logo"
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
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer', alignSelf: 'center' }}
            onClick={() => navigate('/')}
          >
            {title} Dashboard
          </Typography>
          <Typography
            variant="body2"
            sx={{ mr: 3, display: { xs: 'none', sm: 'block' } }}
          >
            {timeStr}
          </Typography>

          <IconButton color="inherit" onClick={onToggleTheme} sx={{ mr: 1 }}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

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

        {tabsData.length > 0 && <TabBar tabsData={tabsData} />}
      </AppBar>
      <Box sx={{ height: tabsData.length > 0 ? '112px' : '64px' }} />
    </>
  );
}