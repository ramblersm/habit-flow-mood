
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateNavigationProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const DateNavigation = ({ currentDate, onDateChange }: DateNavigationProps) => {
  const goToPreviousDay = () => {
    const previousDay = new Date(currentDate);
    previousDay.setDate(currentDate.getDate() - 1);
    onDateChange(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    onDateChange(nextDay);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = currentDate.toDateString() === new Date().toDateString();
  const isFutureDate = currentDate > new Date();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border">
      <Button
        variant="outline"
        size="sm"
        onClick={goToPreviousDay}
        className="flex items-center gap-1"
      >
        <ChevronLeft size={16} />
        Previous
      </Button>
      
      <div className="text-center">
        <div className="text-lg font-semibold text-gray-900">
          {formatDate(currentDate)}
        </div>
        {!isToday && (
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="text-blue-600 hover:text-blue-700 text-sm mt-1"
          >
            Go to Today
          </Button>
        )}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={goToNextDay}
        disabled={isFutureDate}
        className="flex items-center gap-1"
      >
        Next
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default DateNavigation;
