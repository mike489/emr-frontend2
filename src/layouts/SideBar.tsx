import {
  Drawer,
  Toolbar,
  IconButton,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import {
  Dashboard as DashboardIcon,
  People as PatientsIcon,
  CalendarToday as AppointmentsIcon,
  LocalHospital as VisitsIcon,
  Assignment as LabIcon,
  Image as RadiologyIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const DRAWER_WIDTH = 260;

interface SideBarProps {
  open: boolean;
  onClose: () => void;
}

const allMenu = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Patients', icon: <PatientsIcon />, path: '/patients' },
  { text: 'Appointments', icon: <AppointmentsIcon />, path: '/appointments' },
  { text: 'Visits', icon: <VisitsIcon />, path: '/visits' },
  { text: 'Laboratory', icon: <LabIcon />, path: '/lab' },
  { text: 'Radiology', icon: <RadiologyIcon />, path: '/radiology' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

export default function SideBar({ open, onClose }: SideBarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const rolePermissions = user?.roles?.map((r: any) => r.name) ?? [];
  const isSuperAdmin = rolePermissions.includes('Super_Admin');
  const isDoctor = rolePermissions.includes('Doctor');
  const isNurse = rolePermissions.includes('Nurse');

  const menuItems = allMenu.filter(item => {
    if (isSuperAdmin) return true;
    if (
      isDoctor &&
      ['Patients', 'Appointments', 'Visits', 'Laboratory', 'Radiology'].includes(item.text)
    )
      return true;
    if (isNurse && ['Patients', 'Visits', 'Laboratory'].includes(item.text)) return true;
    return false;
  });

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
        },
      }}
    >
      <Toolbar>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map(item => (
          <ListItemButton
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) onClose();
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} color="#000" />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
