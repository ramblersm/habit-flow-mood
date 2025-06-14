
import React from 'react';

interface ProgressSectionProps {
  completedHabits: number;
  totalHabits: number;
}

const ProgressSection = ({ completedHabits, totalHabits }: ProgressSectionProps) => {
  return (
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
  );
};

export default ProgressSection;
