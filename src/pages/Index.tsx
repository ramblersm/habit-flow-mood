
import React from 'react';
import Header from '@/components/Header';
import ProgressSection from '@/components/ProgressSection';
import HabitsSection from '@/components/HabitsSection';
import MoodTracker from '@/components/MoodTracker';
import { useHabits } from '@/hooks/useHabits';
import { useMood } from '@/hooks/useMood';

const Index = () => {
  const { habits, loading, addHabit, toggleHabit, deleteHabit, saveHabit } = useHabits();
  const { mood, setMoodEntry } = useMood();

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
          <ProgressSection 
            completedHabits={completedHabits}
            totalHabits={totalHabits}
          />

          {/* Habits Section */}
          <HabitsSection
            habits={habits}
            onToggleHabit={toggleHabit}
            onDeleteHabit={deleteHabit}
            onAddHabit={addHabit}
            onSaveHabit={saveHabit}
          />

          {/* Mood Tracker */}
          <MoodTracker
            mood={mood}
            onMoodChange={setMoodEntry}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
