
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CalendarDays, BarChart3, TrendingUp } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
      <Header />
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Summary
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Track your progress over time</p>
        </div>

        <Tabs defaultValue="daily" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto bg-white shadow-lg border-0">
            <TabsTrigger 
              value="daily" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
            >
              <CalendarDays size={16} className="sm:size-4" />
              <span>Daily</span>
            </TabsTrigger>
            <TabsTrigger 
              value="weekly" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
            >
              <BarChart3 size={16} className="sm:size-4" />
              <span>Weekly</span>
            </TabsTrigger>
            <TabsTrigger 
              value="monthly" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              <TrendingUp size={16} className="sm:size-4" />
              <span>Monthly</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="lg:col-span-1 bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-lg">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl text-blue-800 flex items-center gap-2">
                    <CalendarDays className="text-blue-600" size={20} />
                    Select Date
                  </CardTitle>
                  <CardDescription className="text-sm text-blue-600">
                    Choose a date to view your habits and mood
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 sm:p-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border mx-auto bg-white shadow-sm"
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
      <BottomNavigation />
    </div>
  );
};

export default Analytics;
