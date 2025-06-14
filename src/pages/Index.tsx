
import React from 'react';
import Header from '@/components/Header';
import HabitsSection from '@/components/HabitsSection';
import ProgressSection from '@/components/ProgressSection';
import MoodTracker from '@/components/MoodTracker';
import BottomNavigation from '@/components/BottomNavigation';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { useHabits } from '@/hooks/useHabits';
import { useMood } from '@/hooks/useMood';

const Index = () => {
  const { habits, addHabit, toggleHabit, deleteHabit, saveHabit } = useHabits();
  const { mood, setMoodEntry } = useMood();

  const completedHabits = habits.filter(habit => habit.completed).length;
  const totalHabits = habits.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <HabitsSection 
          habits={habits}
          onToggleHabit={toggleHabit}
          onDeleteHabit={deleteHabit}
          onAddHabit={addHabit}
          onSaveHabit={saveHabit}
        />
        <ProgressSection 
          completedHabits={completedHabits}
          totalHabits={totalHabits}
        />
        <MoodTracker 
          mood={mood}
          onMoodChange={setMoodEntry}
        />
      </div>
      <BottomNavigation />
      <PWAInstallPrompt />
    </div>
  );
};

export default Index;
