
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';

interface WeeklySummaryProps {
  data: Array<{
    weekStart: string;
    weekEnd: string;
    totalHabits: number;
    completedHabits: number;
    averageMood: number | null;
    habitCompletion: Record<string, number>;
  }>;
  isLoading: boolean;
}

const WeeklySummary = ({ data, isLoading }: WeeklySummaryProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading weekly data...</div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((week, index) => ({
    week: `Week ${index + 1}`,
    completionRate: week.totalHabits > 0 ? Math.round((week.completedHabits / week.totalHabits) * 100) : 0,
    mood: week.averageMood ? Math.round(week.averageMood * 10) / 10 : null,
    completed: week.completedHabits,
    total: week.totalHabits
  }));

  const chartConfig = {
    completionRate: {
      label: "Completion Rate (%)",
    },
    mood: {
      label: "Average Mood",
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data[0]?.totalHabits > 0 
                ? Math.round((data[0].completedHabits / data[0].totalHabits) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {data[0]?.completedHabits || 0}/{data[0]?.totalHabits || 0} habits completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data[0]?.averageMood ? data[0].averageMood.toFixed(1) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weekly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.length >= 2 && data[0]?.totalHabits > 0 && data[1]?.totalHabits > 0 ? (
                ((data[0].completedHabits / data[0].totalHabits) - 
                 (data[1].completedHabits / data[1].totalHabits)) > 0 ? '↗️' : '↘️'
              ) : '➡️'}
            </div>
            <p className="text-xs text-muted-foreground">
              vs last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Completion Rate</CardTitle>
            <CardDescription>
              Percentage of habits completed each week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="completionRate" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood Trend</CardTitle>
            <CardDescription>
              Average mood rating over the weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.filter(d => d.mood !== null)}>
                  <XAxis dataKey="week" />
                  <YAxis domain={[1, 5]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklySummary;
