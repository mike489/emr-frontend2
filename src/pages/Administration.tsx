import { Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ModuleCard } from '../features/shared/components/ModuleCard';
import PageHeader from '../features/shared/components/PageHeader';
import { ADMIN_MODULES } from '../config/administrationModules';

// const adminModules = [
//   {
//     title: 'ADMINISTRATION',
//     icon: <Shield size={60} color="#9c27b0" />,
//     entryRoute: '/administration',
//   },
//   { title: 'CHIEF ADMIN', icon: <UserCog size={60} color="#9c27b0" />, entryRoute: '/chief-admin' },
//   {
//     title: 'ADMINISTRATOR',
//     icon: <Users size={60} color="#9c27b0" />,
//     entryRoute: '/administrator',
//   },
//   { title: 'FINANCE', icon: <Banknote size={60} color="#9c27b0" />, entryRoute: '/finance' },
//   { title: 'MANAGEMENT', icon: <Shield size={60} color="#9c27b0" />, entryRoute: '/management' },
//   { title: 'REPORT', icon: <UserCog size={60} color="#9c27b0" />, entryRoute: '/report' },
// ];

const Administration = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <PageHeader
        title="Welcome to the Administration Panel"
        subtitle="Please select your account"
        onBack={() => navigate('/')}
      />

      <Grid container spacing={2} justifyContent={{ md: 'flex-center', xs: 'center' }} pt={4}>
        {ADMIN_MODULES.map(mod => (
          <Grid key={mod.title}>
            <ModuleCard
              title={mod.title}
              image={mod.Icon}
              onClick={() => navigate(mod.entryRoute)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Administration;
