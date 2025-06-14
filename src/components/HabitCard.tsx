
import React from 'react';
import { Check, X, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Habit {
  id: string;
  name: string;
  type: 'positive' | 'negative';
  completed: boolean;
}

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const HabitCard = ({ habit, onToggle, onEdit, onDelete }: HabitCardProps) => {
  const isPositive = habit.type === 'positive';
  const isCompleted = habit.completed;

  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
      isCompleted 
        ? isPositive 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onToggle(habit.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              isCompleted
                ? isPositive
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'bg-red-500 border-red-500 text-white'
                : isPositive
                  ? 'border-green-300 hover:border-green-400'
                  : 'border-red-300 hover:border-red-400'
            }`}
          >
            {isCompleted && <Check size={14} />}
          </button>
          <span className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {habit.name}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            isPositive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {isPositive ? 'Positive' : 'Negative'}
          </span>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(habit.id)}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <Edit size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(habit.id)}
            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
