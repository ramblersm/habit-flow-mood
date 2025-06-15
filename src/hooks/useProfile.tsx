
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  age: number | null;
  gender: string | null;
  setup_completed: boolean | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!user) {
      console.log('useProfile - No user, clearing profile and stopping load');
      setProfile(null);
      setLoading(false);
      return;
    }

    console.log('useProfile - Loading profile for user:', user.id);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('useProfile - Error loading profile:', error);
        throw error;
      }
      
      console.log('useProfile - Profile loaded:', data);
      
      // If no profile exists, create a basic one
      if (!data) {
        console.log('useProfile - No profile found, creating basic profile');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            setup_completed: false
          })
          .select()
          .single();

        if (createError) {
          console.error('useProfile - Error creating profile:', createError);
          throw createError;
        }

        setProfile(newProfile);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('useProfile - Error loading profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    refetchProfile: loadProfile
  };
};
