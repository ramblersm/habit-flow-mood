import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingData {
  name: string;
  age: string;
  email: string;
  gender: string;
  password: string;
}

interface OnboardingFlowProps {
  onComplete: () => void;
  onSwitchToLogin: () => void;
}

const OnboardingFlow = ({ onComplete, onSwitchToLogin }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    age: '',
    email: '',
    gender: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { createAccount } = useAuth();
  const { toast } = useToast();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    console.log('OnboardingFlow - Starting account creation with data:', {
      name: data.name,
      age: data.age,
      email: data.email,
      gender: data.gender,
      passwordLength: data.password.length
    });
    
    setLoading(true);

    try {
      // Step 1: Create the account
      const { error: authError } = await createAccount(data.email, data.password);

      if (authError) {
        console.error('OnboardingFlow - Account creation error:', authError);
        toast({
          title: 'Error',
          description: authError.message || 'Failed to create account',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      console.log('OnboardingFlow - Account created, waiting for auth state...');

      // Step 2: Wait a moment for auth state to settle
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Get the current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData?.user) {
        console.error('OnboardingFlow - Error getting user after signup:', userError);
        toast({
          title: 'Error',
          description: 'Account created but failed to get user data. Please try logging in.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const user = userData.user;
      console.log('OnboardingFlow - User obtained:', user.id);

      // Step 4: Create or update the profile with complete data
      const profileData = {
        id: user.id,
        email: user.email,
        full_name: data.name.trim(),
        age: parseInt(data.age),
        gender: data.gender,
        setup_completed: false, // Will be set to true in Setup page
      };

      console.log('OnboardingFlow - Creating profile with data:', profileData);

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (profileError) {
        console.error('OnboardingFlow - Error creating profile:', profileError);
        toast({
          title: 'Profile Creation Failed',
          description: 'Your account was created but we had trouble setting up your profile. Please try refreshing the page.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      console.log('OnboardingFlow - Profile created successfully');

      toast({
        title: 'Welcome to HabitHaven!',
        description: "Your account is ready. Setting up your sanctuary...",
      });

      // Let the auth context and ProtectedRoute handle the navigation
      // Don't manually navigate here to avoid race conditions
      onComplete();

    } catch (error) {
      console.error('OnboardingFlow - Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return data.name.trim().length > 0;
      case 2:
        return data.age.trim().length > 0 && parseInt(data.age) > 0 && parseInt(data.age) <= 120;
      case 3:
        return data.email.trim().length > 0 && data.email.includes('@');
      case 4:
        return data.gender.trim().length > 0;
      case 5:
        return data.password.trim().length >= 6;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">What's your name?</h2>
              <p className="text-gray-600 mt-2">Let's start building your personal sanctuary</p>
            </div>
            <div>
              <Label htmlFor="name" className="text-gray-700">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="Enter your full name"
                className="mt-1 bg-white/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="font-medium text-blue-600 hover:underline"
                  disabled={loading}
                >
                  Sign in to your haven
                </button>
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">How old are you?</h2>
              <p className="text-gray-600 mt-2">This helps us personalize your experience</p>
            </div>
            <div>
              <Label htmlFor="age" className="text-gray-700">Age</Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                value={data.age}
                onChange={(e) => setData({ ...data, age: e.target.value })}
                placeholder="Enter your age"
                className="mt-1 bg-white/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">What's your email?</h2>
              <p className="text-gray-600 mt-2">We'll use this to create your secure account</p>
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="Enter your email"
                className="mt-1 bg-white/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">How do you identify?</h2>
              <p className="text-gray-600 mt-2">This helps us provide relevant content</p>
            </div>
            <div>
              <Label htmlFor="gender" className="text-gray-700">Gender</Label>
              <select
                id="gender"
                value={data.gender}
                onChange={(e) => setData({ ...data, gender: e.target.value })}
                className="mt-1 flex h-10 w-full rounded-md border border-blue-200 bg-white/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Create a secure password</h2>
              <p className="text-gray-600 mt-2">Choose a strong password to protect your account</p>
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                placeholder="Enter a secure password (min 6 characters)"
                className="mt-1 bg-white/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters required</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Home className="h-12 w-12 text-blue-600" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                HabitHaven
              </h1>
              <p className="text-sm text-blue-500 font-medium">Your daily sanctuary</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-indigo-500" />
            <h2 className="text-xl font-bold text-gray-900">
              Welcome to Your Haven
            </h2>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/20">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              className="flex-1 mr-2"
            >
              Back
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid() || loading}
                className="flex-1 ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={!isStepValid() || loading}
                className="flex-1 ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
              >
                {loading ? 'Creating your haven...' : 'Create My Haven'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
