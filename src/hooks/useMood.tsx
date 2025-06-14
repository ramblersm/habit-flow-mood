
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useMood = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [mood, setMood] = useState<number | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const loadMoodEntry = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('mood')
        .eq('user_id', user?.id)
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      
      setMood(data?.mood || null);
    } catch (error) {
      console.error('Error loading mood:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadMoodEntry();
    }
  }, [user]);

  const setMoodEntry = async (moodValue: number) => {
    try {
      await supabase
        .from('mood_entries')
        .upsert({
          user_id: user?.id,
          date: today,
          mood: moodValue
        });

      setMood(moodValue);
      
      toast({
        title: "Mood recorded",
        description: "Your mood for today has been saved.",
      });
    } catch (error) {
      console.error('Error saving mood:', error);
      toast({
        title: "Error",
        description: "Failed to save mood.",
        variant: "destructive",
      });
    }
  };

  return {
    mood,
    setMoodEntry
  };
};
