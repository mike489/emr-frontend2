import { Container, Typography, Box } from '@mui/material';

import { useAuthStore } from '../store/useAuthStore';
import AppLayout from './AppLayout';

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <AppLayout>
      <Container sx={{ mt: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            EMR Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back, <strong>{user?.name ?? 'User'}</strong>
          </Typography>
        </Box>

        {/* Welcome Message */}
        <Box sx={{ mt: 6, textAlign: '' }}>
          <Typography
            variant="h1"
            fontWeight={700}
            color="primary"
            sx={{ fontSize: { xs: 40, md: 60 } }}
          >
            Welcome to EMR
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Manage patients, appointments, labs, and radiology with ease.
          </Typography>
        </Box>
      </Container>
    </AppLayout>
  );
};

export default Dashboard;
