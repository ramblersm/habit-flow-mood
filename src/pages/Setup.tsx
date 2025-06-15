
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Home, Sparkles } from 'lucide-react';

const Setup = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refetchProfile } = useProfile();

  useEffect(() => {
    const setupProfile = async () => {
      if (!user) return;

      setLoading(true);
      console.log('Setup - Auto-setting up profile for user:', user.id);

      try {
        // Check if profile already exists and is complete
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('setup_completed')
          .eq('id', user.id)
          .single();

        if (existingProfile?.setup_completed) {
          console.log('Setup - Profile already completed, redirecting');
          navigate('/', { replace: true });
          return;
        }

        // Mark setup as completed
        const { error } = await supabase
          .from('profiles')
          .update({ setup_completed: true })
          .eq('id', user.id);

        if (error) {
          console.error('Setup - Error updating profile:', error);
          throw error;
        }

        console.log('Setup - Profile setup completed, refetching profile');
        await refetchProfile();

        toast({
          title: "Welcome to HabitHaven!",
          description: "Your sanctuary is ready. Let's start building great habits!",
        });

        navigate('/', { replace: true });
      } catch (error) {
        console.error('Setup - Error:', error);
        toast({
          title: "Error",
          description: "Failed to complete setup. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    setupProfile();
  }, [user, navigate, refetchProfile, toast]);

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
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-indigo-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Setting up your Haven
            </h2>
          </div>
          <p className="text-gray-600">
            Please wait while we prepare your personal sanctuary...
          </p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {loading ? 'Finalizing your sanctuary...' : 'Almost ready...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;
