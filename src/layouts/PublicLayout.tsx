import { Outlet } from 'react-router-dom';
import { Container, Paper } from '@mui/material';
import Header from '../features/shared/components/Header';
import Footer from '../features/shared/components/Footer';

export const PublicLayout = () => (
  <>
    <Header />
    <Container maxWidth="lg" sx={{ mt: 3, mb: 6 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          overflow: 'hidden',
          bgcolor: '#fff',
          minHeight: '70vh',
          // border: '1px solid #ddd',
          p: { xs: 2, sm: 1 },
        }}
      >
        <Outlet />
      </Paper>
    </Container>
    <Footer />
  </>
);
