import {
  Container,
  Box,
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  alpha,
  useTheme,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LockPerson, Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/useAuthStore';
import ForgotPasswordDialog from '../features/shared/components/ForgotPasswordDialog';

const LoginPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);
  const location = useLocation();

  const redirectTo = (location.state as { from?: string })?.from || '/clinics';

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Must be a valid email').required('Email is required'),
      password: Yup.string()
        .min(4, 'Password must be at least 4 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await login(values.email, values.password);
        toast.success('Login successful!', { autoClose: 2000 });
        navigate(redirectTo, { replace: true });
      } catch (error: any) {
        const msg =
          error?.response?.data?.data?.message ||
          error?.data.data.message ||
          'Invalid email or password';
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        }}
      >
        <CircularProgress
          size={60}
          sx={{
            color: 'white',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        py: 4,
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

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Modern Login Card */}
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: 'white',
            boxShadow: `0 25px 50px ${alpha(theme.palette.primary.dark, 0.3)}`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              py: 4,
              px: 4,
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
              <LockPerson
                sx={{
                  fontSize: 48,
                  mb: 2,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                }}
              />
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  mb: 1,
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  fontSize: { xs: '1.75rem', md: '2rem' },
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  fontWeight: 300,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                }}
              >
                Sign in to your medical account
              </Typography>
            </Box>
          </Box>

          {/* Login Form Section */}
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
              p: { xs: 3, md: 4 },
            }}
          >
            <Stack spacing={3}>
              <TextField
                label="Email Address"
                fullWidth
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Forgot Password */}
              <Box
                component="button"
                type="button"
                onClick={() => setOpenForgot(true)}
                sx={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'right',
                  width: '100%',
                  cursor: 'pointer',
                  p: 0,
                  alignSelf: 'flex-end',
                }}
              >
                <Typography
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Forgot Password?
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={formik.isSubmitting}
                  startIcon={formik.isSubmitting ? <CircularProgress size={20} /> : undefined}
                  sx={{
                    flex: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    py: 1.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: theme.palette.grey[400],
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {formik.isSubmitting ? 'Signing in...' : 'Login'}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/')}
                  sx={{
                    flex: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    py: 1.5,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderColor: theme.palette.primary.dark,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.2)}`,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              py: 2,
              px: 4,
              textAlign: 'center',
              borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              background: alpha(theme.palette.primary.main, 0.02),
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
              }}
            >
              Secure medical portal &copy; 2025 HealthTech Solutions
            </Typography>
          </Box>
        </Paper>
      </Container>

      <ForgotPasswordDialog open={openForgot} onClose={() => setOpenForgot(false)} />
    </Box>
  );
};

export default LoginPage;
