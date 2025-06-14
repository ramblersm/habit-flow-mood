
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddHabitFormProps {
  onAdd: (name: string, type: 'positive' | 'negative') => void;
  onCancel: () => void;
}

const AddHabitForm = ({ onAdd, onCancel }: AddHabitFormProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'positive' | 'negative'>('positive');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), type);
      setName('');
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="habit-name">Habit Name</Label>
          <Input
            id="habit-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter habit name..."
            className="mt-1"
            autoFocus
          />
        </div>
        
        <div>
          <Label>Habit Type</Label>
          <div className="flex space-x-2 mt-2">
            <button
              type="button"
              onClick={() => setType('positive')}
              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                type === 'positive'
                  ? 'bg-green-100 border-green-300 text-green-700'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Positive
            </button>
            <button
              type="button"
              onClick={() => setType('negative')}
              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                type === 'negative'
                  ? 'bg-red-100 border-red-300 text-red-700'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Negative
            </button>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button type="submit" className="flex-1" disabled={!name.trim()}>
            <Plus size={16} className="mr-2" />
            Add Habit
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            <X size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddHabitForm;
