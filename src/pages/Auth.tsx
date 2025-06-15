
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import OnboardingFlow from '@/components/OnboardingFlow';
import LoginForm from '@/components/LoginForm';

const Auth = () => {
  const [isNewUser, setIsNewUser] = useState(true);
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  // ✅ Let ProtectedRoute handle redirects after auth is complete
  useEffect(() => {
    if (!loading && user && !profileLoading && profile) {
      console.log('Auth.tsx - User authenticated with profile, redirecting based on setup status');
      
      if (!profile.setup_completed) {
        console.log('Auth.tsx - Redirecting to /setup');
        navigate('/setup', { replace: true });
      } else {
        console.log('Auth.tsx - Redirecting to /');
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, profile, profileLoading, navigate]);

  const handleOnboardingComplete = () => {
    console.log('Auth - Onboarding completed, auth state will handle redirect');
    // Don't manually navigate - let the useEffect above handle it
  };

  const handleSwitchToLogin = () => {
    setIsNewUser(false);
  };

  const handleSwitchToOnboarding = () => {
    setIsNewUser(true);
  };

  // Show loading while auth is being resolved
  if (loading || (user && profileLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isNewUser) {
    return (
      <OnboardingFlow
        onComplete={handleOnboardingComplete}
        onSwitchToLogin={handleSwitchToLogin}
      />
    );
  }

  return <LoginForm onSwitchToOnboarding={handleSwitchToOnboarding} />;
};

export default Auth;
