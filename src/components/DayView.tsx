
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Calendar, Smile } from 'lucide-react';

interface DayViewProps {
  date: Date;
  data: {
    date: string;
    habits: Array<{
      id: string;
      name: string;
      type: 'positive' | 'negative';
      completed: boolean;
    }>;
    mood: number | null;
  } | null;
  isLoading: boolean;
}

const DayView = ({ date, data, isLoading }: DayViewProps) => {
  const getMoodEmoji = (mood: number) => {
    const emojis = ['😢', '😕', '😐', '😊', '😄'];
    return emojis[mood - 1] || '😐';
  };

  const getMoodLabel = (mood: number) => {
    const labels = ['Very Bad', 'Bad', 'Okay', 'Good', 'Excellent'];
    return labels[mood - 1] || 'Unknown';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const completedHabits = data?.habits.filter(h => h.completed).length || 0;
  const totalHabits = data?.habits.length || 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={20} />
            {date.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardTitle>
          <CardDescription>
            Your habits and mood for this day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Habits Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Habits Summary</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600">
                  {completedHabits}/{totalHabits}
                </span>
                <span className="text-gray-600">completed</span>
                {totalHabits > 0 && (
                  <Badge variant="secondary">
                    {Math.round((completedHabits / totalHabits) * 100)}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Mood */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Smile size={20} />
                Mood
              </h3>
              {data?.mood ? (
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{getMoodEmoji(data.mood)}</span>
                  <div>
                    <div className="font-semibold">{getMoodLabel(data.mood)}</div>
                    <div className="text-sm text-gray-600">{data.mood}/5</div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">No mood recorded</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Habits List */}
      <Card>
        <CardHeader>
          <CardTitle>Habits Detail</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.habits.length ? (
            <div className="space-y-3">
              {data.habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {habit.completed ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <XCircle className="text-gray-400" size={20} />
                    )}
                    <span className={habit.completed ? 'text-green-700' : 'text-gray-500'}>
                      {habit.name}
                    </span>
                  </div>
                  <Badge 
                    variant={habit.type === 'positive' ? 'default' : 'destructive'}
                  >
                    {habit.type}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              No habits recorded for this day
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DayView;
