import { useLocation, Navigate } from 'react-router-dom';
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

export default function PrivateRoute({ children }: Props) {
  const { token, isLoading, isTokenValid, logout } = useAuthStore();
  const location = useLocation();

  if (token && !isTokenValid()) {
    logout();
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (isLoading) return <Loading />;

  return token && isTokenValid() ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
