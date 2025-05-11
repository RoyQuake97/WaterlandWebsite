import React, { useState, useEffect } from 'react';
import { Thermometer, CalendarDays } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const WeatherWidget: React.FC = () => {
  const [daysUntilOpening, setDaysUntilOpening] = useState(0);
  
  // Temperature data query
  interface TempData {
    c: number;
  }
  
  const { data: tempData } = useQuery<TempData>({
    queryKey: ['/api/wtemp'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  useEffect(() => {
    const calculateDaysUntilOpening = () => {
      const today = new Date();
      const openingDate = new Date('May 23, 2025');
      const timeDiff = openingDate.getTime() - today.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysUntilOpening(dayDiff > 0 ? dayDiff : 0);
    };
    
    calculateDaysUntilOpening();
  }, []);
  
  // Check if the resort is open (after May 23, 2025)
  const isOpen = new Date() >= new Date('May 23, 2025');
  
  return (
    <motion.div 
      className="flex flex-col md:flex-row gap-4 items-center justify-center bg-gradient-to-r from-[#35b9e6]/10 to-[#4db848]/10 p-4 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Temperature */}
      <motion.div 
        className="flex items-center gap-2 bg-white/75 px-4 py-2 rounded-lg shadow-sm"
        whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Thermometer className="h-5 w-5 text-[#1683bf]" />
        </motion.div>
        <span className="text-[#0A4C8B] font-medium whitespace-nowrap">
          <span className="sm:hidden">Temp: {tempData?.c ?? '--'}°C</span>
          <span className="hidden sm:inline">Live Temperature: {tempData?.c ?? '--'}°C in Zghartā</span>
        </span>
      </motion.div>
      
      {/* Opening info / countdown */}
      <motion.div 
        className="flex items-center gap-2 bg-white/75 px-4 py-2 rounded-lg shadow-sm"
        whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      >
        <motion.div
          initial={{ rotate: 10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <CalendarDays className="h-5 w-5 text-[#f78e24]" />
        </motion.div>
        {isOpen ? (
          <span className="text-[#0A4C8B] font-medium">Open Daily: 10:00 am - 7:00 pm</span>
        ) : (
          <motion.span 
            className="text-[#0A4C8B] font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Season begins in <motion.span 
              className="font-bold" 
              animate={{ 
                scale: [1, 1.1, 1],
                color: ['#0A4C8B', '#f78e24', '#0A4C8B']
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >{daysUntilOpening}</motion.span> days ⏳
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WeatherWidget;
