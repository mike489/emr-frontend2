import { useState } from 'react';
import {
  Container,
  Box,
  Grid,
  alpha,
  useTheme,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ModuleCard } from '../features/shared/components/ModuleCard';
import { CLINIC_MODULES, type ClinicModule } from '../config/clinicModules';
import { useAuthStore } from '../store/useAuthStore';
import { ArrowBack, LockOutlined, Logout, West } from '@mui/icons-material';

const Clinics = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { token, isTokenValid, hasPermission, user, logout } = useAuthStore();

  const [showDeniedModal, setShowDeniedModal] = useState(false);

  const isLoggedIn = !!user && !!token && isTokenValid();
  const userPermissions = user?.permissions ?? [];

  const checkPermission = (mod: ClinicModule) => {
    const triagePermissions = ['triage_one_access', 'triage_two_access', 'triage_three_access'];
    const hasAnyTriageAccess = userPermissions.some(p => triagePermissions.includes(p));
    if (mod.entryRoute === '/triage-lists' && hasAnyTriageAccess) return true;

    const doctorPermissions = [
      'retina_access',
      'glaucoma_access',
      'pediatric_access',
      'opd_one_access',
      'opd_two_access',
      'opd_three_access',
    ];
    const hasAnyDoctorAccess = userPermissions.some(p => doctorPermissions.includes(p));
    if (mod.entryRoute === '/clinic-lists' && hasAnyDoctorAccess) return true;

    return hasPermission(mod.permission);
  };

  const handleClick = (mod: ClinicModule) => {
    const route = mod.entryRoute;
    if (!isLoggedIn) {
      if (route === '/triage-lists' || route === '/clinic-lists') {
        navigate(route);
      } else {
        navigate('/login', { state: { from: route } });
      }
      return;
    }

    if (checkPermission(mod)) {
      navigate(route);
    } else {
      setShowDeniedModal(true);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: 4,
        px: 2,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
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
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}
          >
            Clinic Modules
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
            Access specialized clinical tools and features
          </Typography>
        </Box>

        {/* Grid Section */}
        <Box sx={{ p: { xs: 3, md: 6 } }}>
          <Grid container spacing={3} justifyContent="center">
            {CLINIC_MODULES.map(mod => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}
                key={mod.title}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <Box sx={{ transition: '0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
                  <ModuleCard
                    title={mod?.title}
                    image={mod.Icon}
                    disabled={false}
                    onClick={() => handleClick(mod)}
                    sx={{ borderRadius: 3, height: '100%' }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* --- MODAL WITH WHITE BORDER --- */}
      <Dialog
        open={showDeniedModal}
        onClose={() => setShowDeniedModal(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1,
            maxWidth: 400,
            border: `1px solid ${alpha('#ffffff', 0.9)}`, // Matches the container border
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
              margin: '0 auto mb: 3',
              mb: 2,
            }}
          >
            <LockOutlined sx={{ color: theme.palette.error.main, fontSize: 40 }} />
          </Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Access Restricted
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ px: 2 }}>
            Your account does not have the necessary permissions to access this specific module.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 4, px: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<West />}
            onClick={() => setShowDeniedModal(false)}
            sx={{ borderRadius: 2, py: 1 }}
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
            sx={{ borderRadius: 2, py: 1 }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <IconButton
        onClick={() => navigate('/')}
        sx={{ position: 'absolute', top: 20, left: 20, zIndex: 2, background: 'white' }}
      >
        <ArrowBack />
      </IconButton>
    </Container>
  );
};

export default Clinics;
