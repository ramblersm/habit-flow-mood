
import React from 'react';

interface MoodTrackerProps {
  mood: number | null;
  onMoodChange: (mood: number) => void;
  selectedDate: Date;
}

const MoodTracker = ({ mood, onMoodChange, selectedDate }: MoodTrackerProps) => {
  const moods = [
    { value: 1, emoji: '😢', label: 'Very Bad' },
    { value: 2, emoji: '😔', label: 'Bad' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '😊', label: 'Good' },
    { value: 5, emoji: '😄', label: 'Excellent' }
  ];

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        How are you feeling today?
      </h3>
      <div className="flex justify-center space-x-4">
        {moods.map((moodOption) => (
          <button
            key={moodOption.value}
            onClick={() => onMoodChange(moodOption.value)}
            className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
              mood === moodOption.value
                ? 'bg-white shadow-lg scale-110 border-2 border-blue-300'
                : 'hover:bg-white hover:shadow-md hover:scale-105'
            }`}
          >
            <span className="text-2xl mb-1">{moodOption.emoji}</span>
            <span className="text-xs text-gray-600 font-medium">
              {moodOption.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodTracker;
