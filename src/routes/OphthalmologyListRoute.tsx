// Create a new route guard component for TriageLists
// import { useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Box, CircularProgress } from '@mui/material';

interface Props {
  children: React.ReactNode;
}

export default function OphthalmologyListRoute({ children }: Props) {
  const { token, isLoading, isTokenValid, logout } = useAuthStore();
  // const location = useLocation();OPHTHALMOLOGY

  const Loading = () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
      <CircularProgress />
    </Box>
  );
  if (isLoading) return <Loading />;

  // For TriageLists, we don't require login
  // But if user is logged in and token is invalid, log them out
  if (token && !isTokenValid()) {
    logout();
    // Still show TriageLists, but with logged out state
    return <>{children}</>;
  }

  // Always show TriageLists regardless of login status
  return <>{children}</>;
}
