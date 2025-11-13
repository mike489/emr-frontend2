import { Container, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ModuleCard } from '../features/shared/components/ModuleCard';
import PageHeader from '../features/shared/components/PageHeader';
import { CLINIC_MODULES } from '../config/clinicModules';
import { useAuthStore } from '../store/useAuthStore';

const Clinics = () => {
  const navigate = useNavigate();
  const { token, isTokenValid } = useAuthStore();

  const handleClick = (route: string) => {
    if (token && isTokenValid()) {
      navigate(route);
    } else {
      navigate('/login', { state: { from: route } });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <PageHeader title="Welcome to EMR" onBack={() => navigate('/')} />

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2} justifyContent="center">
          {CLINIC_MODULES.map(mod => {
            const Icon = mod.Icon;
            return (
              <Grid
                size={{ xs: 6, md: 2.5 }}
                key={mod.title}
                display="flex"
                justifyContent="center"
              >
                <ModuleCard
                  title={mod?.title}
                  icon={<Icon size={60} color="#1976d2" strokeWidth={1.5} />}
                  onClick={() => handleClick(mod.entryRoute)}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Container>
  );
};

export default Clinics;
