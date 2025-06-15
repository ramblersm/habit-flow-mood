import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const location = useLocation();

  console.log('ProtectedRoute - Current location:', location.pathname);
  console.log('ProtectedRoute - User:', user?.id);
  console.log('ProtectedRoute - Profile:', profile);
  console.log('ProtectedRoute - Auth loading:', authLoading, 'Profile loading:', profileLoading);

  // 🛡️ Wait until both user and profile are resolved
  if (authLoading || profileLoading || profile === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your space...</p>
        </div>
      </div>
    );
  }

  // 🔐 No user? Redirect to auth
  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // 🔄 Incomplete setup? Redirect to setup
  if (!profile.setup_completed && location.pathname !== '/setup') {
    console.log('ProtectedRoute - Setup not completed, redirecting to setup');
    return <Navigate to="/setup" replace />;
  }

  // 🏠 Setup done? Don’t allow going back to /setup
  if (profile.setup_completed && location.pathname === '/setup') {
    console.log('ProtectedRoute - Setup completed, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute - Access allowed:', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
