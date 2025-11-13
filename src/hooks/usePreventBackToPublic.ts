// src/hooks/usePreventBackToPublic.ts
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';

export const usePreventBackToPublic = () => {
  const { token, isTokenValid } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePopState = () => {
      if (
        token &&
        isTokenValid() &&
        (location.pathname === '/login' || location.pathname === '/register')
      ) {
        navigate('/clinic-lists', { replace: true });
      }
    };

    window.addEventListener('popstate', handlePopState);

    // cleanup on unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [token, isTokenValid, navigate, location]);
};
