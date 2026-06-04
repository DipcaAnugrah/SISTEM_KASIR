import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTE_PERMISSIONS, hasAccess } from './roleConfig';

// ============================================================
// PROTECTED ROUTE — Single guard, satu level
// Cek: (1) autentikasi, (2) role permission
// ============================================================

function ProtectedRoute({ children }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // === 1. Belum login → redirect ke /login ===
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // === 2. Cek permission route berdasarkan role ===
  const requiredRole = ROUTE_PERMISSIONS[location.pathname];
  if (requiredRole && !hasAccess(role, requiredRole)) {
    // Role tidak cukup → redirect ke dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
