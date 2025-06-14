
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

interface MonthlySummaryProps {
  data: Array<{
    month: string;
    year: number;
    totalHabits: number;
    completedHabits: number;
    averageMood: number | null;
    streaks: Record<string, number>;
    moodTrend: Array<{ date: string; mood: number }>;
  }>;
  isLoading: boolean;
}

const MonthlySummary = ({ data, isLoading }: MonthlySummaryProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading monthly data...</div>
        </CardContent>
      </Card>
    );
  }

  // Ensure data is in reverse chronological order (most recent first)
  const chartData = [...data].reverse().map((month) => ({
    month: `${month.month.slice(0, 3)} ${month.year}`,
    completionRate: month.totalHabits > 0 ? Math.round((month.completedHabits / month.totalHabits) * 100) : 0,
    mood: month.averageMood ? Math.round(month.averageMood * 10) / 10 : null,
    completed: month.completedHabits,
    total: month.totalHabits
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
    <ScrollArea className="h-[calc(100vh-300px)] w-full">
      <div className="space-y-6 pr-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data[0]?.totalHabits > 0 
                  ? Math.round((data[0].completedHabits / data[0].totalHabits) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Mood</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data[0]?.averageMood ? data[0].averageMood.toFixed(1) : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                average this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data[0]?.completedHabits || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                habits this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.length >= 2 && data[0]?.totalHabits > 0 && data[1]?.totalHabits > 0 ? (
                  ((data[0].completedHabits / data[0].totalHabits) - 
                   (data[1].completedHabits / data[1].totalHabits)) > 0 ? '📈' : '📉'
                ) : '📊'}
              </div>
              <p className="text-xs text-muted-foreground">
                vs last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
              <CardDescription>
                Habit completion rate by month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <div className="min-w-[500px]">
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area 
                          type="monotone" 
                          dataKey="completionRate" 
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mood Over Time</CardTitle>
              <CardDescription>
                Monthly average mood ratings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <div className="min-w-[500px]">
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData.filter(d => d.mood !== null)}>
                        <XAxis dataKey="month" />
                        <YAxis domain={[1, 5]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="mood" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Monthly Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Breakdown</CardTitle>
            <CardDescription>
              Detailed statistics for each month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 pr-4">
                {data.slice(0, 3).map((month, index) => (
                  <div key={`${month.month}-${month.year}`} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{month.month} {month.year}</h3>
                      <div className="text-sm text-gray-600">
                        {month.totalHabits > 0 
                          ? Math.round((month.completedHabits / month.totalHabits) * 100)
                          : 0}% completion
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Completed</div>
                        <div className="font-semibold">{month.completedHabits}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Total</div>
                        <div className="font-semibold">{month.totalHabits}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Avg Mood</div>
                        <div className="font-semibold">
                          {month.averageMood ? month.averageMood.toFixed(1) : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default MonthlySummary;
