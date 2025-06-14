
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Habit {
  id: string;
  name: string;
  type: 'positive' | 'negative';
  completed: boolean;
}

export const useHabits = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const loadHabitsAndEntries = useCallback(async (date: Date) => {
    if (!user) return;
    
    try {
      const dateStr = formatDate(date);
      
      // Get user's habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      if (habitsError) throw habitsError;

      // Get habit entries for the specific date
      const { data: entriesData, error: entriesError } = await supabase
        .from('habit_entries')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', dateStr);

      if (entriesError) throw entriesError;

      // Combine habits with completion status for the selected date
      const habitsWithCompletion = (habitsData || []).map(habit => ({
        id: habit.id,
        name: habit.name,
        type: habit.type as 'positive' | 'negative',
        completed: entriesData?.some(entry => entry.habit_id === habit.id && entry.completed) || false
      }));

      setHabits(habitsWithCompletion);
      setCurrentDate(date);
    } catch (error) {
      console.error('Error loading habits:', error);
      toast({
        title: "Error",
        description: "Failed to load habits.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      loadHabitsAndEntries(new Date());
    }
  }, [user, loadHabitsAndEntries]);

  const addHabit = async (name: string, type: 'positive' | 'negative') => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{
          user_id: user?.id,
          name,
          type
        }])
        .select()
        .single();

      if (error) throw error;

      const newHabit: Habit = {
        id: data.id,
        name: data.name,
        type: data.type as 'positive' | 'negative',
        completed: false
      };

      setHabits(prev => [...prev, newHabit]);
      
      toast({
        title: "Habit added",
        description: `${name} has been added to your habits.`,
      });
    } catch (error) {
      console.error('Error adding habit:', error);
      toast({
        title: "Error",
        description: "Failed to add habit.",
        variant: "destructive",
      });
    }
  };

  const toggleHabit = async (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const newCompleted = !habit.completed;
    const dateStr = formatDate(currentDate);

    try {
      if (newCompleted) {
        // Create or update entry as completed
        await supabase
          .from('habit_entries')
          .upsert({
            user_id: user?.id,
            habit_id: id,
            date: dateStr,
            completed: true
          });
      } else {
        // Delete the entry
        await supabase
          .from('habit_entries')
          .delete()
          .eq('user_id', user?.id)
          .eq('habit_id', id)
          .eq('date', dateStr);
      }

      setHabits(prev => prev.map(h => 
        h.id === id ? { ...h, completed: newCompleted } : h
      ));
    } catch (error) {
      console.error('Error toggling habit:', error);
      toast({
        title: "Error",
        description: "Failed to update habit.",
        variant: "destructive",
      });
    }
  };

  const deleteHabit = async (id: string) => {
    const habit = habits.find(h => h.id === id);
    
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setHabits(prev => prev.filter(h => h.id !== id));
      
      toast({
        title: "Habit deleted",
        description: `${habit?.name} has been removed.`,
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error",
        description: "Failed to delete habit.",
        variant: "destructive",
      });
    }
  };

  const saveHabit = async (id: string, name: string, type: 'positive' | 'negative') => {
    try {
      const { error } = await supabase
        .from('habits')
        .update({ name, type })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setHabits(prev => prev.map(h => 
        h.id === id ? { ...h, name, type } : h
      ));

      toast({
        title: "Habit updated",
        description: `${name} has been updated.`,
      });
    } catch (error) {
      console.error('Error updating habit:', error);
      toast({
        title: "Error",
        description: "Failed to update habit.",
        variant: "destructive",
      });
    }
  };

  const loadHabitsForDate = useCallback((date: Date) => {
    loadHabitsAndEntries(date);
  }, [loadHabitsAndEntries]);

  return {
    habits,
    loading,
    addHabit,
    toggleHabit,
    deleteHabit,
    saveHabit,
    loadHabitsForDate
  };
};
