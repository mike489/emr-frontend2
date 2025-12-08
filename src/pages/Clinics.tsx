import {
  Container,
  Box,
  Grid,
  alpha,
  useTheme,
  Paper,
  Typography,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ModuleCard } from '../features/shared/components/ModuleCard';
import { CLINIC_MODULES } from '../config/clinicModules';
import { useAuthStore } from '../store/useAuthStore';
import { ArrowBack } from '@mui/icons-material';

const Clinics = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { token, isTokenValid } = useAuthStore();

  const handleClick = (route: string) => {
    if (token && isTokenValid()) {
      navigate(route);
    } else {
      navigate('/login', { state: { from: route } });
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
      {/* Animated Background Elements */}
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
        {/* Header with Primary Gradient */}
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
            {/* <MedicalServices
              sx={{
                fontSize: 48,
                mb: 1,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
              }}
            /> */}
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                mb: 2,
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Clinic Modules
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                fontWeight: 300,
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              Access specialized clinical tools and features
            </Typography>
          </Box>
        </Box>

        {/* Modules Grid Section */}
        <Box sx={{ p: { xs: 3, md: 6 } }}>
          {/* <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 1,
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              Clinical Workspace
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '0.9rem', md: '1rem' },
              }}
            >
              Streamline your medical practice with our comprehensive suite of clinical tools
            </Typography>
          </Box> */}

          <Grid container spacing={3} justifyContent="center">
            {CLINIC_MODULES.map((mod, _index) => {
              const Icon = mod.Icon;
              return (
                <Grid
                  size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}
                  key={mod.title}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      transform: 'scale(1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                      },
                    }}
                  >
                    <ModuleCard
                      title={mod?.title}
                      image={Icon}
                      onClick={() => handleClick(mod.entryRoute)}
                      sx={{
                        borderRadius: 3,
                        boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.1)}`,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        transition: 'all 0.3s ease-in-out',
                        background: `linear-gradient(145deg, #ffffff 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                        height: '100%',
                        '&:hover': {
                          boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          background: `linear-gradient(145deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, #ffffff 100%)`,
                        },
                      }}
                    />
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          {/* Accent Divider */}
          <Box
            sx={{
              width: '80px',
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              margin: '40px auto 30px',
              borderRadius: '2px',
              opacity: 0.8,
            }}
          />

          {/* Footer Note */}
          <Typography
            variant="body2"
            textAlign="center"
            sx={{
              display: 'block',
              opacity: 0.7,
              color: theme.palette.primary.main,
              fontWeight: 500,
            }}
          >
            Secure clinical access • Professional medical tools • HIPAA Compliant
          </Typography>
        </Box>
      </Paper>

      {/* Back Button */}
      <IconButton
        onClick={() => navigate('/')}
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
    </Container>
  );
};

export default Clinics;
