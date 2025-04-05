
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: { module: string; action: string };
  requiredRole?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredPermission,
  requiredRole
}: ProtectedRouteProps) => {
  const { user, loading, hasPermission, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      // Check if user is authenticated
      if (!user) {
        // Redirect to login page with return URL
        navigate('/auth', { state: { returnUrl: location.pathname } });
        return;
      }

      // Check for required permission
      if (requiredPermission && !hasPermission(requiredPermission.module, requiredPermission.action)) {
        // Redirect to unauthorized page or dashboard
        navigate('/');
        return;
      }

      // Check for required role
      if (requiredRole && !hasRole(requiredRole)) {
        // Redirect to unauthorized page or dashboard
        navigate('/');
        return;
      }
    }
  }, [user, loading, navigate, location.pathname, requiredPermission, requiredRole, hasPermission, hasRole]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If authenticated and has required permission/role, show the protected content
  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
