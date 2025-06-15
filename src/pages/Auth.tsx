
import React, { useState } from 'react';
import OnboardingFlow from '@/components/OnboardingFlow';
import LoginForm from '@/components/LoginForm';

const Auth = () => {
  const [isNewUser, setIsNewUser] = useState(true);

  const handleOnboardingComplete = () => {
    console.log('Auth - Onboarding completed, user should be redirected by ProtectedRoute');
    // The user will be automatically redirected by ProtectedRoute once authenticated
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
