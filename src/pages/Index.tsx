
import React from 'react';
import Header from '@/components/Header';
import HabitsSection from '@/components/HabitsSection';
import ProgressSection from '@/components/ProgressSection';
import MoodTracker from '@/components/MoodTracker';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <HabitsSection />
        <ProgressSection />
        <MoodTracker />
      </div>
      <PWAInstallPrompt />
    </div>
  );
};

export default Index;
