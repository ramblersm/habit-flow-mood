
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingFlow from '@/components/OnboardingFlow';
import LoginForm from '@/components/LoginForm';

const Auth = () => {
  const [isNewUser, setIsNewUser] = useState(true);
  const { loading } = useAuth();

  const handleOnboardingComplete = () => {
    console.log('Auth - Onboarding completed, auth state will handle redirect');
    // Let ProtectedRoute handle all navigation automatically
  };

  const handleSwitchToLogin = () => {
    setIsNewUser(false);
  };

  const handleSwitchToOnboarding = () => {
    setIsNewUser(true);
  };

  // Show loading only during initial auth check
  if (loading) {
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
