import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Smile } from 'lucide-react';

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
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="text-center text-purple-600 flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
            Loading monthly data...
          </div>
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

  const getTrendIcon = () => {
    if (data.length >= 2 && data[0]?.totalHabits > 0 && data[1]?.totalHabits > 0) {
      const current = data[0].completedHabits / data[0].totalHabits;
      const previous = data[1].completedHabits / data[1].totalHabits;
      return current > previous ? 
        <TrendingUp className="text-green-500" size={24} /> : 
        <TrendingDown className="text-red-500" size={24} />;
    }
    return <Calendar className="text-gray-500" size={24} />;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data[0]?.totalHabits > 0 
                ? Math.round((data[0].completedHabits / data[0].totalHabits) * 100)
                : 0}%
            </div>
            <p className="text-xs text-blue-100">
              completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-100 flex items-center gap-1">
              <Smile size={16} />
              Monthly Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getMoodEmoji(data[0]?.averageMood || null)}
            </div>
            <p className="text-xs text-purple-100">
              average this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-100">Total Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data[0]?.completedHabits || 0}
            </div>
            <p className="text-xs text-green-100">
              habits this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-100 flex items-center gap-1">
              Monthly Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center justify-center">
              {getTrendIcon()}
            </div>
            <p className="text-xs text-orange-100 text-center">
              vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-indigo-800">Monthly Progress</CardTitle>
            <CardDescription className="text-indigo-600">
              Habit completion rate by month
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-6">
            <ScrollArea className="w-full">
              <div className="min-w-[400px] pr-4">
                <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="month" 
                        fontSize={10}
                        tick={{ fontSize: 10, fill: '#4f46e5' }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis fontSize={10} tick={{ fontSize: 10, fill: '#4f46e5' }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="completionRate" 
                        stroke="#6366f1"
                        strokeWidth={3}
                        fill="url(#colorCompletion)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
          <CardHeader>
            <CardTitle className="text-pink-800 flex items-center gap-2">
              <Smile className="text-pink-600" size={20} />
              Mood Over Time
            </CardTitle>
            <CardDescription className="text-pink-600">
              Monthly average mood ratings
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-6">
            <ScrollArea className="w-full">
              <div className="min-w-[400px] pr-4">
                <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.filter(d => d.mood !== null)} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis 
                        dataKey="month" 
                        fontSize={10}
                        tick={{ fontSize: 10, fill: '#be185d' }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis domain={[1, 5]} fontSize={10} tick={{ fontSize: 10, fill: '#be185d' }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="mood" 
                        stroke="#ec4899"
                        strokeWidth={4}
                        dot={{ fill: "#ec4899", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, fill: "#be185d" }}
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
      <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Monthly Breakdown</CardTitle>
          <CardDescription className="text-slate-600">
            Detailed statistics for each month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4 pr-4">
              {data.slice(0, 3).map((month, index) => (
                <div key={`${month.month}-${month.year}`} className={`border rounded-lg p-4 ${
                  index === 0 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' 
                    : index === 1 
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
                    : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className={`font-semibold ${
                      index === 0 ? 'text-blue-700' : index === 1 ? 'text-purple-700' : 'text-green-700'
                    }`}>
                      {month.month} {month.year}
                    </h3>
                    <div className={`text-sm px-2 py-1 rounded-full ${
                      index === 0 
                        ? 'bg-blue-100 text-blue-700' 
                        : index === 1 
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {month.totalHabits > 0 
                        ? Math.round((month.completedHabits / month.totalHabits) * 100)
                        : 0}% completion
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className={index === 0 ? 'text-blue-600' : index === 1 ? 'text-purple-600' : 'text-green-600'}>
                        Completed
                      </div>
                      <div className="font-semibold text-lg">{month.completedHabits}</div>
                    </div>
                    <div>
                      <div className={index === 0 ? 'text-blue-600' : index === 1 ? 'text-purple-600' : 'text-green-600'}>
                        Total
                      </div>
                      <div className="font-semibold text-lg">{month.totalHabits}</div>
                    </div>
                    <div>
                      <div className={`flex items-center gap-1 ${index === 0 ? 'text-blue-600' : index === 1 ? 'text-purple-600' : 'text-green-600'}`}>
                        <Smile size={14} />
                        Avg Mood
                      </div>
                      <div className="font-semibold text-lg">
                        {getMoodEmoji(month.averageMood)}
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
  );
};

export default MonthlySummary;
