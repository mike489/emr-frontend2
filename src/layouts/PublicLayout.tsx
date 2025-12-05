import { Outlet } from 'react-router-dom';
import { Container, Paper } from '@mui/material';
import Header from '../features/shared/components/Header';
import Footer from '../features/shared/components/Footer';

export const PublicLayout = () => (
  <>
    <Header />
    <Container maxWidth="xl" sx={{ mt: 3, mb: 6 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          overflow: 'hidden',
          bgcolor: '#fff',
          minHeight: '70vh',
        }}
      >
        <Outlet />
      </Paper>
    </Container>
    <Footer />
  </>
);
