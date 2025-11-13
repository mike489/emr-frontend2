import { Container, Typography, Box } from '@mui/material';
import PageHeader from '../features/shared/components/PageHeader';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8, alignItems: 'center', justifyContent: 'center' }}>
      <PageHeader
        title="EMR Dashboard"
        subtitle="Welcome back, Dr. Sharma"
        onBack={() => navigate('/')}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
        }}
      >
        <Typography sx={{ fontSize: 50, fontWeight: 700, color: 'primary.main' }}>
          Welcome to EMR
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;
