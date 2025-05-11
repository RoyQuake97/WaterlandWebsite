import { addDays, format, differenceInDays, isSameDay, isWithinInterval, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, startOfYear, endOfYear, eachMonthOfInterval, subDays, subMonths, subYears } from 'date-fns';

// Helper function to calculate number of nights
export const calculateNights = (checkIn: string | Date, checkOut: string | Date): number => {
  const startDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
  const endDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;
  return differenceInDays(endDate, startDate);
};

// Helper to calculate room price per night
export const getRoomPrice = (roomType: string, siteSettings: any): number => {
  const defaultPrices = {
    junior: 250,
    twin: 300,
    ambassador: 350
  };

  if (!siteSettings) return defaultPrices[roomType as keyof typeof defaultPrices] || 0;

  return roomType === 'junior' 
    ? siteSettings.juniorRoomPrice 
    : roomType === 'twin' 
      ? siteSettings.twinRoomPrice 
      : siteSettings.ambassadorRoomPrice || 0;
};

// Calculate reservation total price
export const calculateReservationTotal = (
  roomType: string, 
  checkIn: string | Date, 
  checkOut: string | Date, 
  siteSettings: any
): number => {
  const nights = calculateNights(checkIn, checkOut);
  const pricePerNight = getRoomPrice(roomType, siteSettings);
  return nights * pricePerNight;
};

// Check if a date is within a reservation
export const isDateBooked = (date: Date, checkIn: Date, checkOut: Date): boolean => {
  // Include check-in day, exclude check-out day (as that's when new guests can arrive)
  return isWithinInterval(date, { start: checkIn, end: subDays(checkOut, 1) });
};

// Calculate occupancy for a single day
export const calculateDailyOccupancy = (
  date: Date, 
  reservations: any[], 
  totalRooms: number = 30
): number => {
  const bookedRooms = reservations.filter(res => {
    const checkIn = new Date(res.checkInDate);
    const checkOut = new Date(res.checkOutDate);
    return isDateBooked(date, checkIn, checkOut);
  }).length;
  
  return Math.round((bookedRooms / totalRooms) * 100);
};

// Generate revenue and occupancy data for charts
export const generateRevenueData = (
  reservations: any[],
  siteSettings: any,
  totalRooms: number = 30
) => {
  const now = new Date();
  
  // Generate weekly data (last 7 days)
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(now, 6 - i);
    const dayReservations = reservations.filter(res => {
      const checkIn = new Date(res.checkInDate);
      const dayMatch = isSameDay(checkIn, date);
      return dayMatch;
    });
    
    const revenue = dayReservations.reduce((sum, res) => {
      return sum + calculateReservationTotal(res.roomType, res.checkInDate, res.checkOutDate, siteSettings);
    }, 0);
    
    const occupancy = calculateDailyOccupancy(date, reservations, totalRooms);
    
    return {
      name: format(date, 'EEE'),
      revenue,
      occupancy
    };
  });
  
  // Generate monthly data (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(now, 5 - i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const monthReservations = reservations.filter(res => {
      const checkIn = new Date(res.checkInDate);
      return checkIn >= monthStart && checkIn <= monthEnd;
    });
    
    const revenue = monthReservations.reduce((sum, res) => {
      return sum + calculateReservationTotal(res.roomType, res.checkInDate, res.checkOutDate, siteSettings);
    }, 0);
    
    // Calculate average occupancy for the month
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const monthOccupancy = daysInMonth.reduce((sum, day) => {
      return sum + calculateDailyOccupancy(day, reservations, totalRooms);
    }, 0) / daysInMonth.length;
    
    return {
      name: format(date, 'MMM'),
      revenue,
      occupancy: Math.round(monthOccupancy)
    };
  });
  
  // Generate yearly data (last 4 quarters)
  const yearlyData = Array.from({ length: 4 }, (_, i) => {
    const quarterMonths = [
      subMonths(now, i * 3 + 2),
      subMonths(now, i * 3 + 1),
      subMonths(now, i * 3)
    ];
    
    const quarterStart = startOfMonth(quarterMonths[0]);
    const quarterEnd = endOfMonth(quarterMonths[2]);
    
    const quarterReservations = reservations.filter(res => {
      const checkIn = new Date(res.checkInDate);
      return checkIn >= quarterStart && checkIn <= quarterEnd;
    });
    
    const revenue = quarterReservations.reduce((sum, res) => {
      return sum + calculateReservationTotal(res.roomType, res.checkInDate, res.checkOutDate, siteSettings);
    }, 0);
    
    // Calculate average occupancy for the quarter
    const daysInQuarter = eachDayOfInterval({ start: quarterStart, end: quarterEnd });
    const quarterOccupancy = daysInQuarter.reduce((sum, day) => {
      return sum + calculateDailyOccupancy(day, reservations, totalRooms);
    }, 0) / daysInQuarter.length;
    
    const quarterIndex = Math.floor((11 - (i * 3)) / 3) + 1;
    const yearOffset = quarterIndex === 4 && now.getMonth() < 3 ? -1 : 0; // Handle Q4 of previous year
    
    return {
      name: `Q${quarterIndex} ${now.getFullYear() + yearOffset}`,
      revenue,
      occupancy: Math.round(quarterOccupancy)
    };
  }).reverse(); // Reverse to get chronological order
  
  return {
    weekly: weeklyData,
    monthly: monthlyData,
    yearly: yearlyData
  };
};