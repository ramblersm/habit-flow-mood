
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HabitsSection from '@/components/HabitsSection';
import ProgressSection from '@/components/ProgressSection';
import MoodTracker from '@/components/MoodTracker';
import BottomNavigation from '@/components/BottomNavigation';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import DateNavigation from '@/components/DateNavigation';
import { useHabits } from '@/hooks/useHabits';
import { useMood } from '@/hooks/useMood';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { habits, addHabit, toggleHabit, deleteHabit, saveHabit, loadHabitsForDate } = useHabits();
  const { mood, setMoodEntry, loadMoodForDate } = useMood();

  const completedHabits = habits.filter(habit => habit.completed).length;
  const totalHabits = habits.length;

  // Load data when selected date changes
  useEffect(() => {
    if (loadHabitsForDate) {
      loadHabitsForDate(selectedDate);
    }
    if (loadMoodForDate) {
      loadMoodForDate(selectedDate);
    }
  }, [selectedDate, loadHabitsForDate, loadMoodForDate]);

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <DateNavigation 
          currentDate={selectedDate}
          onDateChange={handleDateChange}
        />
        <HabitsSection 
          habits={habits}
          onToggleHabit={toggleHabit}
          onDeleteHabit={deleteHabit}
          onAddHabit={addHabit}
          onSaveHabit={saveHabit}
          selectedDate={selectedDate}
        />
        <ProgressSection 
          completedHabits={completedHabits}
          totalHabits={totalHabits}
        />
        <MoodTracker 
          mood={mood}
          onMoodChange={setMoodEntry}
          selectedDate={selectedDate}
        />
      </div>
      <BottomNavigation />
      <PWAInstallPrompt />
    </div>
  );
};

export default Index;
