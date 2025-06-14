
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CalendarDays, BarChart3, TrendingUp } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import Header from '@/components/Header';
import DayView from '@/components/DayView';
import WeeklySummary from '@/components/WeeklySummary';
import MonthlySummary from '@/components/MonthlySummary';

const Analytics = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { 
    dailyData, 
    weeklyData, 
    monthlyData, 
    isLoading,
    loadDayData,
    loadWeeklyData,
    loadMonthlyData 
  } = useAnalytics();

  useEffect(() => {
    loadDayData(selectedDate);
  }, [selectedDate, loadDayData]);

  useEffect(() => {
    loadWeeklyData();
    loadMonthlyData();
  }, [loadWeeklyData, loadMonthlyData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-sm sm:text-base text-gray-600">Track your progress over time</p>
        </div>

        <Tabs defaultValue="daily" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="daily" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <CalendarDays size={16} className="sm:size-4" />
              <span>Daily</span>
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <BarChart3 size={16} className="sm:size-4" />
              <span>Weekly</span>
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <TrendingUp size={16} className="sm:size-4" />
              <span>Monthly</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Select Date</CardTitle>
                  <CardDescription className="text-sm">
                    Choose a date to view your habits and mood
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 sm:p-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border mx-auto"
                    disabled={(date) => date > new Date()}
                  />
                </CardContent>
              </Card>

              <div className="lg:col-span-2">
                <DayView 
                  date={selectedDate}
                  data={dailyData}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weekly">
            <WeeklySummary 
              data={weeklyData}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="monthly">
            <MonthlySummary 
              data={monthlyData}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
