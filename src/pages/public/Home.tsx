import { Box, Grid, Container, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';



import { Building2, Shield } from 'lucide-react';
import { ModuleCard } from '../../features/shared/components/ModuleCard';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {/* Header */}
      <Stack spacing={0}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            px: 4,
            py: 2,
            bgcolor: 'primary.main',
            color: 'white',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          <Typography variant="h6" fontWeight="bold" textAlign="center">
            Welcome to EMR
          </Typography>
        </Box>
      </Stack>

      {/* Main Content: Cards */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 3, md: 6 },
          mt: 4,
          px: { xs: 2, md: 0 },
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Grid container spacing={4} justifyContent="center">
            {/* CLINICS */}
            <Grid >
              <ModuleCard
                title="CLINICS"
                icon={<Building2 size={60} color="#1976d2" />}
                onClick={() => navigate('/clinics')}
              />
            </Grid>

            {/* ADMINISTRATION */}
            <Grid >
              <ModuleCard
                title="ADMINISTRATION"
                icon={<Shield size={60} color="#9c27b0" />}
                onClick={() => navigate('/administration')}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
