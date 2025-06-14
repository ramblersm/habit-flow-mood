
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DailyData {
  date: string;
  habits: Array<{
    id: string;
    name: string;
    type: 'positive' | 'negative';
    completed: boolean;
  }>;
  mood: number | null;
}

interface WeeklyData {
  weekStart: string;
  weekEnd: string;
  totalHabits: number;
  completedHabits: number;
  averageMood: number | null;
  habitCompletion: Record<string, number>;
}

interface MonthlyData {
  month: string;
  year: number;
  totalHabits: number;
  completedHabits: number;
  averageMood: number | null;
  streaks: Record<string, number>;
  moodTrend: Array<{ date: string; mood: number }>;
}

export const useAnalytics = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  const loadDayData = useCallback(async (date: Date) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const dateStr = date.toISOString().split('T')[0];

      // Get habits for the user
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);

      if (habitsError) throw habitsError;

      // Get habit entries for the specific date
      const { data: entriesData, error: entriesError } = await supabase
        .from('habit_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', dateStr);

      if (entriesError) throw entriesError;

      // Get mood entry for the date
      const { data: moodData, error: moodError } = await supabase
        .from('mood_entries')
        .select('mood')
        .eq('user_id', user.id)
        .eq('date', dateStr)
        .maybeSingle();

      if (moodError) throw moodError;

      // Combine data
      const habits = (habitsData || []).map(habit => ({
        id: habit.id,
        name: habit.name,
        type: habit.type as 'positive' | 'negative',
        completed: entriesData?.some(entry => entry.habit_id === habit.id && entry.completed) || false
      }));

      setDailyData({
        date: dateStr,
        habits,
        mood: moodData?.mood || null
      });
    } catch (error) {
      console.error('Error loading day data:', error);
      toast({
        title: "Error",
        description: "Failed to load day data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const loadWeeklyData = useCallback(async () => {
    if (!user) return;

    try {
      // Get last 8 weeks of data
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 56); // 8 weeks

      console.log('Loading weekly data from', startDate.toISOString().split('T')[0], 'to', endDate.toISOString().split('T')[0]);

      // Get all habits for the user first
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);

      if (habitsError) throw habitsError;

      const { data: entriesData, error: entriesError } = await supabase
        .from('habit_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0]);

      if (entriesError) throw entriesError;

      const { data: moodData, error: moodError } = await supabase
        .from('mood_entries')
        .select('date, mood')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0]);

      if (moodError) throw moodError;

      console.log('Fetched entries:', entriesData?.length, 'mood entries:', moodData?.length);

      // Process weekly data - start from most recent week
      const weeks: WeeklyData[] = [];
      const totalHabits = habitsData?.length || 0;

      for (let i = 0; i < 8; i++) {
        const weekEnd = new Date(endDate);
        weekEnd.setDate(endDate.getDate() - (i * 7));
        const weekStart = new Date(weekEnd);
        weekStart.setDate(weekEnd.getDate() - 6);

        const weekStartStr = weekStart.toISOString().split('T')[0];
        const weekEndStr = weekEnd.toISOString().split('T')[0];

        const weekEntries = entriesData?.filter(entry => 
          entry.date >= weekStartStr && entry.date <= weekEndStr
        ) || [];

        const weekMoods = moodData?.filter(mood => 
          mood.date >= weekStartStr && mood.date <= weekEndStr
        ) || [];

        // Calculate daily totals for the week
        const daysInWeek = 7;
        const expectedTotalHabits = totalHabits * daysInWeek;
        const completedHabits = weekEntries.filter(entry => entry.completed).length;
        
        const averageMood = weekMoods.length > 0 
          ? weekMoods.reduce((sum, mood) => sum + mood.mood, 0) / weekMoods.length
          : null;

        console.log(`Week ${i + 1}: ${weekStartStr} to ${weekEndStr}, completed: ${completedHabits}, total possible: ${expectedTotalHabits}`);

        weeks.push({
          weekStart: weekStartStr,
          weekEnd: weekEndStr,
          totalHabits: expectedTotalHabits,
          completedHabits,
          averageMood,
          habitCompletion: {}
        });
      }

      setWeeklyData(weeks);
    } catch (error) {
      console.error('Error loading weekly data:', error);
      toast({
        title: "Error",
        description: "Failed to load weekly data.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const loadMonthlyData = useCallback(async () => {
    if (!user) return;

    try {
      // Get last 6 months of data
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);

      const { data: entriesData, error: entriesError } = await supabase
        .from('habit_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0]);

      if (entriesError) throw entriesError;

      const { data: moodData, error: moodError } = await supabase
        .from('mood_entries')
        .select('date, mood')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0]);

      if (moodError) throw moodError;

      // Process monthly data
      const months: MonthlyData[] = [];
      for (let i = 0; i < 6; i++) {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - i);
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

        const monthStartStr = monthStart.toISOString().split('T')[0];
        const monthEndStr = monthEnd.toISOString().split('T')[0];

        const monthEntries = entriesData?.filter(entry => 
          entry.date >= monthStartStr && entry.date <= monthEndStr
        ) || [];

        const monthMoods = moodData?.filter(mood => 
          mood.date >= monthStartStr && mood.date <= monthEndStr
        ) || [];

        const completedHabits = monthEntries.filter(entry => entry.completed).length;
        const totalHabits = monthEntries.length;
        const averageMood = monthMoods.length > 0 
          ? monthMoods.reduce((sum, mood) => sum + mood.mood, 0) / monthMoods.length
          : null;

        months.push({
          month: monthDate.toLocaleString('default', { month: 'long' }),
          year: monthDate.getFullYear(),
          totalHabits,
          completedHabits,
          averageMood,
          streaks: {},
          moodTrend: monthMoods.map(mood => ({ date: mood.date, mood: mood.mood }))
        });
      }

      setMonthlyData(months);
    } catch (error) {
      console.error('Error loading monthly data:', error);
      toast({
        title: "Error",
        description: "Failed to load monthly data.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  return {
    dailyData,
    weeklyData,
    monthlyData,
    isLoading,
    loadDayData,
    loadWeeklyData,
    loadMonthlyData
  };
};
