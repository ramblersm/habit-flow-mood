
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HabitCard from '@/components/HabitCard';
import AddHabitForm from '@/components/AddHabitForm';
import EditHabitDialog from '@/components/EditHabitDialog';

interface Habit {
  id: string;
  name: string;
  type: 'positive' | 'negative';
  completed: boolean;
}

interface HabitsSectionProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
  onAddHabit: (name: string, type: 'positive' | 'negative') => void;
  onSaveHabit: (id: string, name: string, type: 'positive' | 'negative') => void;
  selectedDate: Date;
}

const HabitsSection = ({ 
  habits, 
  onToggleHabit, 
  onDeleteHabit, 
  onAddHabit, 
  onSaveHabit,
  selectedDate
}: HabitsSectionProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleAddHabit = (name: string, type: 'positive' | 'negative') => {
    onAddHabit(name, type);
    setShowAddForm(false);
  };

  return (
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
            onToggle={onToggleHabit}
            onEdit={(id) => setEditingHabit(habits.find(h => h.id === id) || null)}
            onDelete={onDeleteHabit}
          />
        ))}

        {showAddForm && (
          <AddHabitForm
            onAdd={handleAddHabit}
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

      {/* Edit Habit Dialog */}
      <EditHabitDialog
        habit={editingHabit}
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        onSave={onSaveHabit}
      />
    </div>
  );
};

export default HabitsSection;
