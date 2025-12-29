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
} from '@mui/material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ModuleCard } from '../features/shared/components/ModuleCard';
import { DOCTOR_MODULES } from '../config/doctorModules';
import { ArrowBack } from '@mui/icons-material';

const ClinicLists = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { hasPermission, user, isLoading, token, isTokenValid } = useAuthStore();

  const isLoggedIn = !!user && !!token && isTokenValid();

  const handleClick = (route: string) => {
    if (isLoggedIn) {
      navigate(route);
    } else {
      navigate('/login', { state: { from: route } });
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

  const accessibleModules = isLoggedIn
    ? DOCTOR_MODULES.filter(mod => hasPermission(mod.permission))
    : DOCTOR_MODULES;

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
      }}
    >
      {/* Background Elements */}
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
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(180deg)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 70%)`,
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      {/* Modern Card Container */}
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          borderRadius: 4,
          overflow: 'hidden',
          background: 'white',
          boxShadow: `0 25px 50px ${alpha(theme.palette.primary.dark, 0.3)}`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            py: { xs: 3, md: 4 },
            px: { xs: 3, md: 6 },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              opacity: 0.3,
            },
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
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                fontWeight: 300,
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              Access specialized medical tools and patient management
            </Typography>
          </Box>
        </Box>

        {/* Access Denied State */}
        {accessibleModules.length === 0 ? (
          <Box sx={{ p: { xs: 3, md: 6 }, textAlign: 'center' }}>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                color: theme.palette.primary.main,
                fontWeight: 600,
              }}
            >
              Access Restricted
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 4,
              }}
            >
              You don't have permission to access any doctor modules.
            </Typography>
            <Box
              onClick={() => navigate('/clinics')}
              sx={{
                display: 'inline-block',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                padding: '12px 32px',
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
              }}
            >
              <Typography variant="body1" fontWeight="600">
                Return to Clinics
              </Typography>
            </Box>
          </Box>
        ) : (
          /* Modules Grid Section */
          <Box sx={{ p: { xs: 3, md: 6 } }}>
            {/* <Typography
              variant="h6"
              textAlign="center"
              sx={{
                mb: 6,
                color: theme.palette.primary.main,
                fontWeight: 600,
              }}
            >
              Available Medical Tools
            </Typography> */}

            <Grid container spacing={4} justifyContent="center">
              {accessibleModules.map(mod => {
                const Icon = mod.icon;
                const allowed = !isLoggedIn || hasPermission(mod.permission);

                return (
                  <Grid
                    size={{ xs: 12, sm: 6, md: 4, lg: 4 }}
                    key={mod.title}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      opacity: allowed ? 1 : 0.4,
                    }}
                  >
                    <Box
                      sx={{
                        transform: 'scale(1)',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: allowed ? 'scale(1.05)' : 'scale(1)',
                        },
                      }}
                    >
                      <ModuleCard
                        title={mod?.title}
                        image={Icon}
                        disabled={!allowed}
                        onClick={() => allowed && handleClick(mod.route)}
                        sx={{
                          borderRadius: 3,
                          boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
                          border: '1px solid #f0f0f0',
                          transition: 'all 0.3s ease-in-out',
                          ...(allowed
                            ? {
                                '&:hover': {
                                  boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.25)}`,
                                  borderColor: alpha(theme.palette.primary.main, 0.3),
                                },
                              }
                            : {}),
                        }}
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            {/* Accent line */}
            <Box
              sx={{
                width: '60px',
                height: '4px',
                background: theme.palette.primary.main,
                margin: '40px auto 20px',
                borderRadius: '2px',
                opacity: 0.7,
              }}
            />

            {/* Footer Note */}
            <Typography
              variant="caption"
              textAlign="center"
              sx={{
                display: 'block',
                opacity: 0.7,
                color: theme.palette.primary.main,
              }}
            >
              Secure medical access • Professional healthcare tools
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Back Button */}
      <IconButton
        onClick={() => navigate('/clinics')}
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          background: alpha('#ffffff', 0.9),
          color: theme.palette.primary.main,
          width: 48,
          height: 48,
          borderRadius: 3,
          boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.2)}`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          transition: 'all 0.3s ease',
          zIndex: 2,
          '&:hover': {
            background: '#ffffff',
            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            transform: 'translateY(-2px)',
          },
        }}
      >
        <ArrowBack />
      </IconButton>

      {/* Brand accent elements */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: '100px',
          height: '100px',
          background: alpha(theme.palette.primary.light, 0.1),
          borderRadius: '50%',
          filter: 'blur(20px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: '150px',
          height: '150px',
          background: alpha(theme.palette.primary.main, 0.1),
          borderRadius: '50%',
          filter: 'blur(25px)',
          zIndex: 0,
        }}
      />
    </Container>
  );
};

export default ClinicLists;
