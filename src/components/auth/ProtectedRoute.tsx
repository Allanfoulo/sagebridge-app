
import { ReactNode, useEffect, useState } from 'react';
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
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        // Wait for loading to complete
        if (loading) return;

        // Check if user is authenticated
        if (!user) {
          if (mounted) {
            setIsAuthorized(false);
            setAuthCheckComplete(true);
            // Redirect to login page with return URL
            navigate('/auth', { state: { returnUrl: location.pathname } });
          }
          return;
        }

        // Check for required permission
        if (requiredPermission && !hasPermission(requiredPermission.module, requiredPermission.action)) {
          if (mounted) {
            setIsAuthorized(false);
            setAuthCheckComplete(true);
            // Redirect to unauthorized page or dashboard
            navigate('/');
          }
          return;
        }

        // Check for required role
        if (requiredRole && !hasRole(requiredRole)) {
          if (mounted) {
            setIsAuthorized(false);
            setAuthCheckComplete(true);
            // Redirect to unauthorized page or dashboard
            navigate('/');
          }
          return;
        }

        // User is authorized
        if (mounted) {
          setIsAuthorized(true);
          setAuthCheckComplete(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        if (mounted) {
          setIsAuthorized(false);
          setAuthCheckComplete(true);
          navigate('/auth', { state: { returnUrl: location.pathname } });
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [user, loading, navigate, location.pathname, requiredPermission, requiredRole, hasPermission, hasRole]);

  // Show loading spinner while checking authentication
  if (loading || !authCheckComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Verifying access...</p>
      </div>
    );
  }

  // If authenticated and has required permission/role, show the protected content
  return isAuthorized ? <>{children}</> : null;
};

export default ProtectedRoute;
