
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import HabitCard from '@/components/HabitCard';
import AddHabitForm from '@/components/AddHabitForm';
import MoodTracker from '@/components/MoodTracker';
import EditHabitDialog from '@/components/EditHabitDialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Habit {
  id: string;
  name: string;
  type: 'positive' | 'negative';
  completed: boolean;
}

interface DayData {
  date: string;
  habits: Habit[];
  mood: number | null;
}

const Index = () => {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [data, setData] = useLocalStorage<DayData[]>('habit-tracker-data', []);

  const today = new Date().toISOString().split('T')[0];
  const todayData = data.find(d => d.date === today) || { date: today, habits: [], mood: null };

  const updateTodayData = (updater: (data: DayData) => DayData) => {
    setData(prevData => {
      const newData = [...prevData];
      const todayIndex = newData.findIndex(d => d.date === today);
      const updatedTodayData = updater(todayData);
      
      if (todayIndex >= 0) {
        newData[todayIndex] = updatedTodayData;
      } else {
        newData.push(updatedTodayData);
      }
      
      return newData;
    });
  };

  const addHabit = (name: string, type: 'positive' | 'negative') => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      type,
      completed: false
    };

    updateTodayData(data => ({
      ...data,
      habits: [...data.habits, newHabit]
    }));

    setShowAddForm(false);
    toast({
      title: "Habit added",
      description: `${name} has been added to your habits.`,
    });
  };

  const toggleHabit = (id: string) => {
    updateTodayData(data => ({
      ...data,
      habits: data.habits.map(habit =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    }));
  };

  const deleteHabit = (id: string) => {
    const habit = todayData.habits.find(h => h.id === id);
    updateTodayData(data => ({
      ...data,
      habits: data.habits.filter(habit => habit.id !== id)
    }));

    toast({
      title: "Habit deleted",
      description: `${habit?.name} has been removed.`,
    });
  };

  const saveHabit = (id: string, name: string, type: 'positive' | 'negative') => {
    updateTodayData(data => ({
      ...data,
      habits: data.habits.map(habit =>
        habit.id === id ? { ...habit, name, type } : habit
      )
    }));

    toast({
      title: "Habit updated",
      description: `${name} has been updated.`,
    });
  };

  const setMood = (mood: number) => {
    updateTodayData(data => ({ ...data, mood }));
    toast({
      title: "Mood recorded",
      description: "Your mood for today has been saved.",
    });
  };

  const completedHabits = todayData.habits.filter(h => h.completed).length;
  const totalHabits = todayData.habits.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Daily Habit Tracker
          </h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          {totalHabits > 0 && (
            <div className="mt-4 inline-block bg-white rounded-full px-4 py-2 shadow-sm">
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
            {todayData.habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={toggleHabit}
                onEdit={(id) => setEditingHabit(todayData.habits.find(h => h.id === id) || null)}
                onDelete={deleteHabit}
              />
            ))}

            {showAddForm && (
              <AddHabitForm
                onAdd={addHabit}
                onCancel={() => setShowAddForm(false)}
              />
            )}

            {todayData.habits.length === 0 && !showAddForm && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">No habits yet</p>
                <p className="text-sm">Add your first habit to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Mood Tracker */}
        <MoodTracker
          mood={todayData.mood}
          onMoodChange={setMood}
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
  );
};

export default Index;
