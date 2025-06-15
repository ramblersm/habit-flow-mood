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

  // 🔁 Add this effect to auto-redirect if user is signed in
  useEffect(() => {
    if (!loading && user && !profileLoading) {
      if (!profile?.setup_completed) {
        navigate('/setup', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, profile, profileLoading, navigate]);

  const handleOnboardingComplete = () => {
    console.log('Auth - Onboarding completed, user should be redirected');
    // No need to manually navigate — useEffect will handle it
  };

  const handleSwitchToLogin = () => {
    console.log('Auth - Switching to login');
    setIsNewUser(false);
  };

  const handleSwitchToOnboarding = () => {
    console.log('Auth - Switching to onboarding');
    setIsNewUser(true);
  };

  if (isNewUser) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} onSwitchToLogin={handleSwitchToLogin} />;
  }

  return <LoginForm onSwitchToOnboarding={handleSwitchToOnboarding} />;
};

export default Auth;
