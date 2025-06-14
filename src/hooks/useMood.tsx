
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useMood = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [mood, setMood] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const loadMoodEntry = useCallback(async (date: Date) => {
    if (!user) return;
    
    try {
      const dateStr = formatDate(date);
      
      const { data, error } = await supabase
        .from('mood_entries')
        .select('mood')
        .eq('user_id', user?.id)
        .eq('date', dateStr)
        .maybeSingle();

      if (error) throw error;
      
      setMood(data?.mood || null);
      setCurrentDate(date);
    } catch (error) {
      console.error('Error loading mood:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadMoodEntry(new Date());
    }
  }, [user, loadMoodEntry]);

  const setMoodEntry = async (moodValue: number) => {
    try {
      const dateStr = formatDate(currentDate);
      
      await supabase
        .from('mood_entries')
        .upsert({
          user_id: user?.id,
          date: dateStr,
          mood: moodValue
        });

      setMood(moodValue);
      
      toast({
        title: "Mood recorded",
        description: "Your mood for this day has been saved.",
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

  const loadMoodForDate = useCallback((date: Date) => {
    loadMoodEntry(date);
  }, [loadMoodEntry]);

  return {
    mood,
    setMoodEntry,
    loadMoodForDate
  };
};
