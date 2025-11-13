import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Box, CircularProgress } from '@mui/material';

interface Props {
  children: React.ReactNode;
}

const Loading = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
    <CircularProgress />
  </Box>
);

export default function PublicRoute({ children }: Props) {
  const { token, isLoading, isTokenValid, logout } = useAuthStore();

  if (isLoading) return <Loading />;

  // If token exists but is invalid -> log out and redirect to login
  if (token && !isTokenValid()) {
    logout();
    return <Navigate to="/login" replace />;
  }

  // If user is logged in and token is valid -> redirect to protected page
  if (token && isTokenValid()) {
    return <Navigate to="/clinic-lists" replace />;
  }

  // Otherwise, render public page (like login/register)
  return <>{children}</>;
}
