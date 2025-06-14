import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Target, Smile } from 'lucide-react';

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
  const getMoodEmoji = (mood: number | null) => {
    if (!mood) return '😐';
    if (mood <= 1.5) return '😢';
    if (mood <= 2.5) return '😞';
    if (mood <= 3.5) return '😐';
    if (mood <= 4.5) return '😊';
    return '😄';
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center text-emerald-600 flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent"></div>
            Loading weekly data...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ensure data is in reverse chronological order (most recent first)
  const chartData = data.map((week, index) => ({
    week: `W${data.length - index}`,
    completionRate: week.totalHabits > 0 ? Math.round((week.completedHabits / week.totalHabits) * 100) : 0,
    mood: week.averageMood ? Math.round(week.averageMood * 10) / 10 : null,
    completed: week.completedHabits,
    total: week.totalHabits
  })).reverse(); // Reverse to show most recent first

  const chartConfig = {
    completionRate: {
      label: "Completion Rate (%)",
    },
    mood: {
      label: "Average Mood",
    },
  };

  const getTrendIcon = () => {
    if (data.length >= 2 && data[0]?.totalHabits > 0 && data[1]?.totalHabits > 0) {
      const current = data[0].completedHabits / data[0].totalHabits;
      const previous = data[1].completedHabits / data[1].totalHabits;
      return current > previous ? 
        <TrendingUp className="text-green-400" size={20} /> : 
        <TrendingDown className="text-red-400" size={20} />;
    }
    return <Target className="text-gray-400" size={20} />;
  };

  return (
    <ScrollArea className="h-[calc(100vh-300px)] w-full">
      <div className="space-y-4 sm:space-y-6 pr-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card className="bg-gradient-to-br from-cyan-500 to-blue-500 border-0 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-cyan-100 flex items-center gap-1">
                <Target size={16} />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {data[0]?.totalHabits > 0 
                  ? Math.round((data[0].completedHabits / data[0].totalHabits) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-cyan-100">
                {data[0]?.completedHabits || 0}/{data[0]?.totalHabits || 0} habits completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-500 to-purple-500 border-0 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-violet-100 flex items-center gap-1">
                <Smile size={16} />
                Average Mood
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {getMoodEmoji(data[0]?.averageMood || null)}
              </div>
              <p className="text-xs text-violet-100">
                This week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-green-500 border-0 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Weekly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold flex items-center justify-center">
                {getTrendIcon()}
              </div>
              <p className="text-xs text-emerald-100 text-center">
                vs last week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-blue-800 flex items-center gap-2">
                <Target className="text-blue-600" size={20} />
                Weekly Completion Rate
              </CardTitle>
              <CardDescription className="text-sm text-blue-600">
                Percentage of habits completed each week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <div className="min-w-[400px] pr-4">
                  <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="week" 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: '#1d4ed8' }}
                        />
                        <YAxis 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}%`}
                          tick={{ fill: '#1d4ed8' }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar 
                          dataKey="completionRate" 
                          fill="url(#colorBar)"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-rose-800 flex items-center gap-2">
                <Smile className="text-rose-600" size={20} />
                Mood Trend
              </CardTitle>
              <CardDescription className="text-sm text-rose-600">
                Average mood rating over the weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <div className="min-w-[400px] pr-4">
                  <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData.filter(d => d.mood !== null)} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <XAxis 
                          dataKey="week" 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: '#be185d' }}
                        />
                        <YAxis 
                          domain={[1, 5]} 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: '#be185d' }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="mood" 
                          stroke="#f43f5e"
                          strokeWidth={3}
                          dot={{ fill: "#f43f5e", strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 7, fill: "#be185d" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};

export default WeeklySummary;
