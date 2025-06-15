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

  // ✅ Only redirect once profile exists
  useEffect(() => {
    if (!loading && user && !profileLoading) {
      if (!profile) {
        console.log('Auth.tsx - Profile is null. Waiting before redirect...');
        return;
      }

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
    console.log('Auth - Onboarding completed');
  };

  const handleSwitchToLogin = () => {
    setIsNewUser(false);
  };

  const handleSwitchToOnboarding = () => {
    setIsNewUser(true);
  };

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
