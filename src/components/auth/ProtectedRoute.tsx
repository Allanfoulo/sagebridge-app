
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: { module: string; action: string };
  requiredRole?: string;
  skipOnboarding?: boolean; // Allow skipping onboarding check for onboarding pages
}

const ProtectedRoute = ({ 
  children, 
  requiredPermission,
  requiredRole,
  skipOnboarding = false
}: ProtectedRouteProps) => {
  const { user, loading, hasPermission, hasRole } = useAuth();
  const { isComplete: profileComplete, loading: profileLoading } = useProfileCompletion();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        // Wait for loading to complete
        if (loading || profileLoading) return;

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

        // Check if profile is complete (unless skipping onboarding)
        if (!skipOnboarding && !profileComplete) {
          if (mounted) {
            setIsAuthorized(false);
            setAuthCheckComplete(true);
            // Redirect to onboarding welcome page
            navigate('/onboarding/welcome');
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
  }, [user, loading, profileLoading, profileComplete, navigate, location.pathname, requiredPermission, requiredRole, hasPermission, hasRole, skipOnboarding]);

  // Show loading spinner while checking authentication
  if (loading || profileLoading || !authCheckComplete) {
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
