import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function PrivateRoute() {
  const token = useAuthStore((state) => state.accessToken);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
