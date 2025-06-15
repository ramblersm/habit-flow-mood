
import React, { useState } from 'react';
import OnboardingFlow from '@/components/OnboardingFlow';
import LoginForm from '@/components/LoginForm';

const Auth = () => {
  const [isNewUser, setIsNewUser] = useState(true);

  const handleOnboardingComplete = () => {
    // The user will be automatically redirected by ProtectedRoute once authenticated
    console.log('Onboarding completed');
  };

  const handleSwitchToLogin = () => {
    setIsNewUser(false);
  };

  const handleSwitchToOnboarding = () => {
    setIsNewUser(true);
  };

  if (isNewUser) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} onSwitchToLogin={handleSwitchToLogin} />;
  }

  return <LoginForm onSwitchToOnboarding={handleSwitchToOnboarding} />;
};

export default Auth;
