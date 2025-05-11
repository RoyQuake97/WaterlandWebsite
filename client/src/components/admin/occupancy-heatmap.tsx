import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { eachDayOfInterval, format, startOfMonth, endOfMonth, addMonths, getDay, 
  isWithinInterval, subDays, isSameMonth } from "date-fns";

interface DayInfo {
  date: Date;
  isCurrentMonth: boolean;
  occupancy: number;
}

interface Reservation {
  id: number;
  checkInDate: string | Date;
  checkOutDate: string | Date;
  roomType: string;
  [key: string]: any;
}

interface OccupancyHeatmapProps {
  reservations: Reservation[];
  month?: Date;
  className?: string;
}

// Helper to get color based on occupancy percentage
const getColorForOccupancy = (percentage: number): string => {
  if (percentage === 0) return "bg-gray-100";
  if (percentage < 30) return "bg-blue-100";
  if (percentage < 60) return "bg-blue-300";
  if (percentage < 80) return "bg-blue-500";
  return "bg-blue-700";
};

export function OccupancyHeatmap({ 
  reservations, 
  month = new Date(),
  className 
}: OccupancyHeatmapProps) {
  // Define room types and counts (simplified for example)
  const roomTypes = {
    junior: 10,
    twin: 10,
    ambassador: 10
  };
  const totalRooms = Object.values(roomTypes).reduce((sum, count) => sum + count, 0);
  
  // Get all days in the current month
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate days in previous month to fill the start of the grid
  const firstDayOfMonthWeekday = getDay(monthStart);
  const daysFromPrevMonth = firstDayOfMonthWeekday === 0 ? 6 : firstDayOfMonthWeekday - 1;
  
  // Calculate calendar grid
  const calendarDays = [
    ...Array.from({ length: daysFromPrevMonth }, (_, i) => {
      const day = subDays(monthStart, daysFromPrevMonth - i);
      return { date: day, isCurrentMonth: false };
    }),
    ...days.map(day => ({ date: day, isCurrentMonth: true }))
  ];
  
  // Calculate occupancy for each day
  const occupancyByDay: DayInfo[] = calendarDays.map(({ date, isCurrentMonth }) => {
    if (!isCurrentMonth) return { date, isCurrentMonth, occupancy: 0 };
    
    // Count bookings for the day
    const bookingsForDay = reservations.filter(res => {
      const checkIn = new Date(res.checkInDate);
      const checkOut = new Date(res.checkOutDate);
      
      // Check if the date falls within a booking period
      return isWithinInterval(date, { 
        start: checkIn, 
        end: subDays(checkOut, 1) // Checkout day is not counted as occupied
      });
    });
    
    const occupancyPercentage = Math.round((bookingsForDay.length / totalRooms) * 100);
    return { date, isCurrentMonth, occupancy: occupancyPercentage };
  });
  
  // Generate the calendar weeks
  const weeks: DayInfo[][] = [];
  for (let i = 0; i < occupancyByDay.length; i += 7) {
    weeks.push(occupancyByDay.slice(i, i + 7));
  }
  
  // Calculate the average occupancy for the month
  const avgMonthOccupancy = Math.round(
    occupancyByDay
      .filter(day => day.isCurrentMonth)
      .reduce((sum, day) => sum + day.occupancy, 0) / days.length
  );
  
  // Get previous and next month dates
  const prevMonth = addMonths(month, -1);
  const nextMonth = addMonths(month, 1);
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Occupancy Heatmap</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{format(month, 'MMMM yyyy')}</span>
          </div>
        </div>
        <CardDescription>Average occupancy: {avgMonthOccupancy}%</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2 text-xs font-medium text-center text-gray-500">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
        <div className="space-y-1">
          {weeks.map((week: DayInfo[], weekIndex: number) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day: DayInfo, dayIndex: number) => (
                <div 
                  key={dayIndex}
                  className={`
                    aspect-square flex flex-col items-center justify-center rounded-md text-xs
                    ${day.isCurrentMonth ? getColorForOccupancy(day.occupancy) : 'bg-gray-50 opacity-30'}
                    ${day.occupancy > 50 ? 'text-white' : 'text-gray-700'}
                  `}
                >
                  <span className="font-medium">{format(day.date, 'd')}</span>
                  {day.isCurrentMonth && day.occupancy > 0 && (
                    <span className="text-[10px]">{day.occupancy}%</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-100 rounded"></div>
              <span>0%</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-100 rounded"></div>
              <span>1-30%</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-300 rounded"></div>
              <span>31-60%</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>61-80%</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-700 rounded"></div>
              <span>81-100%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}