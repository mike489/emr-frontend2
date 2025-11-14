import {
  Container,
  Box,
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/useAuthStore';
import ForgotPasswordDialog from '../features/shared/components/ForgotPasswordDialog';
import PageHeader from '../features/shared/components/PageHeader';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);

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
        navigate('/clinics', { replace: true });
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
      <Container maxWidth="lg" sx={{ mt: 20 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <PageHeader
        title="Welcome to the Login Panel"
        subtitle="Please enter your credentials"
        onBack={() => navigate('/')}
      />
      <Paper
        elevation={0}
        sx={{
          maxWidth: 560,
          mx: 'auto',
          mt: 4,
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: '1px solid #ddd',
        }}
      >
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: { xs: 3, md: 4 },
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <LockPersonIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography sx={{ color: 'black', fontWeight: 500, fontSize: 20 }}>
              Welcome Back!
            </Typography>
          </Box>
          <Divider sx={{ width: '100%', my: 1 }} />

          <Box sx={{ width: '80%', minWidth: 260 }}>
            <Stack spacing={2}>
              <TextField
                label="Email Address"
                size="small"
                fullWidth
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                autoFocus
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                size="small"
                fullWidth
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
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
                }}
              >
                <Typography
                  sx={{ textDecoration: 'underline', color: 'primary.main', fontSize: '0.875rem' }}
                >
                  Forgot Password?
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  disabled={formik.isSubmitting}
                  startIcon={formik.isSubmitting && <CircularProgress size={16} />}
                  sx={{ minWidth: 100, borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                >
                  {formik.isSubmitting ? 'Signing in...' : 'Login'}
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => navigate(-1)}
                  sx={{ minWidth: 100, borderRadius: 2, textTransform: 'none' }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Paper>

      <ForgotPasswordDialog open={openForgot} onClose={() => setOpenForgot(false)} />
    </Container>
  );
};

export default LoginPage;
