
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Habit {
  id: string;
  name: string;
  type: 'positive' | 'negative';
  completed: boolean;
}

interface EditHabitDialogProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, name: string, type: 'positive' | 'negative') => void;
}

const EditHabitDialog = ({ habit, isOpen, onClose, onSave }: EditHabitDialogProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'positive' | 'negative'>('positive');

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setType(habit.type);
    }
  }, [habit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habit && name.trim()) {
      onSave(habit.id, name.trim(), type);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-habit-name">Habit Name</Label>
            <Input
              id="edit-habit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter habit name..."
              className="mt-1"
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

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1" disabled={!name.trim()}>
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditHabitDialog;
