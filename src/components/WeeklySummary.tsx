
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
        <CardContent className="p-4 sm:p-6">
          <div className="text-center text-gray-500">Loading weekly data...</div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((week, index) => ({
    week: `W${data.length - index}`,
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
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
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
            <div className="text-xl sm:text-2xl font-bold">
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
            <div className="text-xl sm:text-2xl font-bold">
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Weekly Completion Rate</CardTitle>
            <CardDescription className="text-sm">
              Percentage of habits completed each week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis 
                    dataKey="week" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
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
            <CardTitle className="text-lg sm:text-xl">Mood Trend</CardTitle>
            <CardDescription className="text-sm">
              Average mood rating over the weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.filter(d => d.mood !== null)} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis 
                    dataKey="week" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={[1, 5]} 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
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
