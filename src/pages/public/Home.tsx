import { Box, Grid, Container, Typography, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Clinic from '../../assets/icons/Clinic.svg';
import Admin from '../../assets/icons/Administration.svg';
import { ModuleCard } from '../../features/shared/components/ModuleCard';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(135deg, #1976d2 0%, #115293 100%)',
        py: 4,
        px: 2,
      }}
    >
      {/* Modern Card Container */}
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: { xs: '400px', md: '800px' },
          borderRadius: 4,
          overflow: 'hidden',
          background: theme.palette.background.paper,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 20px 40px rgba(0, 0, 0, 0.4)'
              : '0 20px 40px rgba(117, 87, 147, 0.2)',
        }}
      >
        {/* Header with theme gradient */}
        <Box
          sx={{
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #90caf9 0%, #1976d2 100%)'
                : 'linear-gradient(135deg, #1976d2 0%, #115293 100%)',
            color: 'white',
            py: 4,
            px: 4,
            textAlign: 'center',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop:
                theme.palette.mode === 'dark' ? '10px solid #1976d2' : '10px solid #115293',
            },
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              mb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Welcome to EMR
          </Typography>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.9,
              fontWeight: 300,
            }}
          >
            Choose your module to continue
          </Typography>
        </Box>

        {/* Cards Section */}
        <Box
          sx={{
            p: { xs: 4, md: 6 },
            background: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{
              mb: 4,
              color: theme.palette.primary.main,
              fontWeight: 600,
            }}
          >
            Select Access Level
          </Typography>

          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {/* CLINICS Card */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  transform: { xs: 'scale(1)', md: 'scale(1.05)' },
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: { xs: 'scale(1.02)', md: 'scale(1.08)' },
                  },
                }}
              >
                <ModuleCard
                  title="CLINICS"
                  image={Clinic}
                  onClick={() => navigate('/clinics')}
                  sx={{
                    borderRadius: 3,
                    boxShadow:
                      theme.palette.mode === 'dark'
                        ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                        : '0 8px 25px rgba(117, 87, 147, 0.15)',
                    border:
                      theme.palette.mode === 'dark'
                        ? `1px solid ${theme.palette.divider}`
                        : '1px solid #f0f0f0',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow:
                        theme.palette.mode === 'dark'
                          ? '0 12px 35px rgba(144, 202, 249, 0.2)'
                          : '0 12px 35px rgba(117, 87, 147, 0.25)',
                      borderColor: theme.palette.primary.light,
                    },
                  }}
                />
              </Box>
            </Grid>

            {/* ADMINISTRATION Card */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  transform: { xs: 'scale(1)', md: 'scale(1.05)' },
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: { xs: 'scale(1.02)', md: 'scale(1.08)' },
                  },
                }}
              >
                <ModuleCard
                  title="ADMINISTRATION"
                  image={Admin}
                  onClick={() => navigate('/administration')}
                  sx={{
                    borderRadius: 3,
                    boxShadow:
                      theme.palette.mode === 'dark'
                        ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                        : '0 8px 25px rgba(117, 87, 147, 0.15)',
                    border:
                      theme.palette.mode === 'dark'
                        ? `1px solid ${theme.palette.divider}`
                        : '1px solid #f0f0f0',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow:
                        theme.palette.mode === 'dark'
                          ? '0 12px 35px rgba(144, 202, 249, 0.2)'
                          : '0 12px 35px rgba(117, 87, 147, 0.25)',
                      borderColor: theme.palette.primary.light,
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Accent line with secondary color */}
          <Box
            sx={{
              width: '60px',
              height: '4px',
              background: theme.palette.secondary.main,
              margin: '32px auto 16px',
              borderRadius: '2px',
            }}
          />

          {/* Footer Note */}
          <Typography
            variant="caption"
            textAlign="center"
            color="text.secondary"
            sx={{
              display: 'block',
              opacity: 0.7,
            }}
          >
            Secure access to Electronic Medical Records system
          </Typography>
        </Box>
      </Paper>

      {/* Theme-aware accent elements */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: '100px',
          height: '100px',
          background:
            theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.1)' : 'rgba(255, 242, 0, 0.1)',
          borderRadius: '50%',
          filter: 'blur(20px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          width: '150px',
          height: '150px',
          background:
            theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(180, 139, 208, 0.1)',
          borderRadius: '50%',
          filter: 'blur(25px)',
          zIndex: 0,
        }}
      />
    </Container>
  );
};

export default Home;
