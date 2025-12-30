import { useState } from 'react';
import {
  Container,
  Box,
  Grid,
  Typography,
  CircularProgress,
  alpha,
  useTheme,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ModuleCard } from '../features/shared/components/ModuleCard';
import { DOCTOR_MODULES } from '../config/doctorModules';
import { ArrowBack, LockOutlined, Logout, West } from '@mui/icons-material';

const ClinicLists = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { hasPermission, user, isLoading, token, isTokenValid, logout } = useAuthStore();

  // State for Permission Modal
  const [showDeniedModal, setShowDeniedModal] = useState(false);

  const isLoggedIn = !!user && !!token && isTokenValid();

  const handleClick = (route: string, permission: string) => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: route } });
      return;
    }

    // Check if user has permission for this specific doctor module
    if (hasPermission(permission)) {
      navigate(route);
    } else {
      setShowDeniedModal(true);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 20 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const isSubRoute = location.pathname.includes('/examinations');

  if (isSubRoute) {
    return <Outlet />;
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: 2,
        p: 4,
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      }}
    >
      {/* Background Elements - Same as original */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.15)} 0%, transparent 70%)`,
          animation: 'float 6s ease-in-out infinite',
        }}
      />

      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          borderRadius: 4,
          overflow: 'hidden',
          background: 'white',
          border: `1px solid ${alpha('#ffffff', 0.8)}`, // White border line
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            py: { xs: 3, md: 4 },
            px: { xs: 3, md: 6 },
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                mb: 2,
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Doctor Modules
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
              Access specialized medical tools and patient management
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 3, md: 6 } }}>
          <Grid container spacing={4} justifyContent="center">
            {DOCTOR_MODULES.map(mod => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4 }}
                key={mod.title}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <Box
                  sx={{
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': { transform: 'translateY(-8px)' },
                  }}
                >
                  <ModuleCard
                    title={mod?.title}
                    image={mod.icon}
                    disabled={false} // ✅ No longer blurred
                    onClick={() => handleClick(mod.route, mod.permission)}
                    sx={{
                      borderRadius: 3,
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.1)}`,
                      border: '1px solid #f0f0f0',
                      height: '100%',
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* --- ACCESS DENIED MODAL WITH WHITE BORDER --- */}
      <Dialog
        open={showDeniedModal}
        onClose={() => setShowDeniedModal(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1,
            maxWidth: 400,
            border: `1px solid ${alpha('#ffffff', 0.9)}`, // White border line
            boxShadow: `0 20px 40px ${alpha('#000000', 0.2)}`,
          },
        }}
      >
        <DialogContent sx={{ textAlign: 'center', pt: 4 }}>
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              width: 80,
              height: 80,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2,
            }}
          >
            <LockOutlined sx={{ color: theme.palette.error.main, fontSize: 40 }} />
          </Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Access Restricted
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your account does not have permission to access this medical module. Please contact your
            administrator.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 4, px: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<West />}
            onClick={() => setShowDeniedModal(false)}
            sx={{ borderRadius: 2 }}
          >
            Return
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="error"
            startIcon={<Logout />}
            onClick={() => {
              logout();
              navigate('/login');
            }}
            sx={{ borderRadius: 2 }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Back Button */}
      <IconButton
        onClick={() => navigate('/clinics')}
        sx={{ position: 'absolute', top: 20, left: 20, zIndex: 2, background: 'white' }}
      >
        <ArrowBack />
      </IconButton>
    </Container>
  );
};

export default ClinicLists;
