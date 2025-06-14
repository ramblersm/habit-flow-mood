
import { useState, useEffect } from 'react';
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

  const loadProfile = async () => {
    if (!user) {
      console.log('useProfile - No user, skipping profile load');
      setProfile(null);
      setLoading(false);
      return;
    }

    console.log('useProfile - Loading profile for user:', user.id);

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
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id]); // Only depend on user.id to prevent unnecessary re-runs

  // Set up real-time subscription to profile changes
  useEffect(() => {
    if (!user) return;

    console.log('useProfile - Setting up profile subscription for user:', user.id);

    const channel = supabase
      .channel(`profile_changes_${user.id}`) // Unique channel name per user
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          console.log('useProfile - Profile updated via subscription:', payload.new);
          setProfile(payload.new as Profile);
        }
      )
      .subscribe();

    return () => {
      console.log('useProfile - Cleaning up profile subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id]); // Only depend on user.id

  return {
    profile,
    loading,
    refetchProfile: loadProfile
  };
};
