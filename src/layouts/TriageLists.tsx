import { Container, Box, Grid, Typography, CircularProgress } from '@mui/material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import PageHeader from '../features/shared/components/PageHeader';

import { useAuthStore } from '../store/useAuthStore';
import { ModuleCard } from '../features/shared/components/ModuleCard';
import { TRIAGE_MODULES } from '../config/triageModule';

const TriageLists = () => {
 const navigate = useNavigate();
   const location = useLocation();
  const { hasPermission, user, isLoading } = useAuthStore();

  const { token, isTokenValid } = useAuthStore();

  const handleClick = (route: string) => {
    if (token && isTokenValid()) {
      navigate(route);
    } else {
      navigate('/login', { state: { from: route } });
    }
  };

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
  const accessibleModules = TRIAGE_MODULES.filter(mod => hasPermission(mod.permission));

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
    <Container>
      <PageHeader title="Welcome to EMR" onBack={() => navigate(-1)} />
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
              <Grid
                size={{ xs: 6, md: 4 }}
                key={mod.title}
                display="flex"
                justifyContent="center"
              >
                <ModuleCard
                  title={mod?.title}
                  image={Icon}
                  onClick={() => handleClick(mod.route)}
                />
              </Grid>
            );
            })}
          </Grid>
        </Container>
      )}
    </Container>
  );
};

export default TriageLists;
