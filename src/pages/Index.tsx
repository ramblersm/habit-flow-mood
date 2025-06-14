
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import HabitCard from '@/components/HabitCard';
import AddHabitForm from '@/components/AddHabitForm';
import MoodTracker from '@/components/MoodTracker';
import EditHabitDialog from '@/components/EditHabitDialog';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Habit {
  id: string;
  name: string;
  type: 'positive' | 'negative';
  completed: boolean;
}

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [mood, setMood] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  // Load habits and today's data
  useEffect(() => {
    if (user) {
      loadHabitsAndEntries();
      loadMoodEntry();
    }
  }, [user]);

  const loadHabitsAndEntries = async () => {
    try {
      // Get user's habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      if (habitsError) throw habitsError;

      // Get today's habit entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('habit_entries')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today);

      if (entriesError) throw entriesError;

      // Combine habits with completion status
      const habitsWithCompletion = (habitsData || []).map(habit => ({
        id: habit.id,
        name: habit.name,
        type: habit.type,
        completed: entriesData?.some(entry => entry.habit_id === habit.id && entry.completed) || false
      }));

      setHabits(habitsWithCompletion);
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
  };

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

      const newHabit = {
        id: data.id,
        name: data.name,
        type: data.type,
        completed: false
      };

      setHabits(prev => [...prev, newHabit]);
      setShowAddForm(false);
      
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

    try {
      if (newCompleted) {
        // Create or update entry as completed
        await supabase
          .from('habit_entries')
          .upsert({
            user_id: user?.id,
            habit_id: id,
            date: today,
            completed: true
          });
      } else {
        // Delete the entry
        await supabase
          .from('habit_entries')
          .delete()
          .eq('user_id', user?.id)
          .eq('habit_id', id)
          .eq('date', today);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your habits...</p>
        </div>
      </div>
    );
  }

  const completedHabits = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Section */}
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-4">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            {totalHabits > 0 && (
              <div className="inline-block bg-white rounded-full px-4 py-2 shadow-sm">
                <span className="text-sm font-medium text-gray-700">
                  {completedHabits} of {totalHabits} habits completed
                </span>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Habits Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Today's Habits
              </h2>
              {!showAddForm && (
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus size={16} className="mr-2" />
                  Add Habit
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleHabit}
                  onEdit={(id) => setEditingHabit(habits.find(h => h.id === id) || null)}
                  onDelete={deleteHabit}
                />
              ))}

              {showAddForm && (
                <AddHabitForm
                  onAdd={addHabit}
                  onCancel={() => setShowAddForm(false)}
                />
              )}

              {habits.length === 0 && !showAddForm && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">No habits yet</p>
                  <p className="text-sm">Add your first habit to get started!</p>
                </div>
              )}
            </div>
          </div>

          {/* Mood Tracker */}
          <MoodTracker
            mood={mood}
            onMoodChange={setMoodEntry}
          />

          {/* Edit Habit Dialog */}
          <EditHabitDialog
            habit={editingHabit}
            isOpen={!!editingHabit}
            onClose={() => setEditingHabit(null)}
            onSave={saveHabit}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
