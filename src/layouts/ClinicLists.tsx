import { Container, Box, Grid, Typography, CircularProgress } from '@mui/material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { SubModuleCard } from '../features/shared/components/SubModuleCard';
import PageHeader from '../features/shared/components/PageHeader';
import { DOCTOR_MODULES } from '../config/doctorModules';
import { useAuthStore } from '../store/useAuthStore';
import AppLayout from './AppLayout';

const ClinicLists = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission, user, isLoading } = useAuthStore();

  console.log('User:', user);

  // ✅ Loading spinner
  if (isLoading || !user) {
    return (
      <Container maxWidth="xl" sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // ✅ Filter accessible modules
  const accessibleModules = DOCTOR_MODULES.filter(mod => hasPermission(mod.permission));

  if (accessibleModules.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <PageHeader title="Access Denied" onBack={() => navigate('/clinics')} />
        <Box mt={4} textAlign="center">
          <Typography variant="h6" color="text.secondary">
            You don't have access to any Doctor modules.
          </Typography>
        </Box>
      </Container>
    );
  }

  // ✅ Detect subroutes (like /examinations)
  const isSubRoute = location.pathname.includes('/examinations');

  return (
    <AppLayout>
      {isSubRoute ? (
        // 🔸 Show nested content (e.g., PatientTabsLayout)
        <Outlet />
      ) : (
        <Container
          sx={{ mt: 4, mb: 20, display: 'center', justifyContent: 'center', alignItems: 'center' }}
        >
          <Grid container spacing={2} mb={200}>
            {accessibleModules.map(mod => {
              const Icon = mod.icon;
              return (
                <Grid key={mod.title} display="flex" justifyContent="center">
                  <SubModuleCard
                    title={mod.title}
                    icon={<Icon size={60} color="#1976d2" strokeWidth={1.5} />}
                    onClick={() => navigate(mod.route)}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Container>
      )}
    </AppLayout>
  );
};

export default ClinicLists;
