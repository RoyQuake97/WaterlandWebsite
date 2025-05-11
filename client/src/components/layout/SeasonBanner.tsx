import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const useCountdown = (targetDate: string) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPassed: true
        };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isPassed: false
      };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);
  
  return timeLeft;
};

const DropletIcon = () => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white drop-shadow-sm"
    animate={{
      scale: [1, 1.15, 1],
      y: [0, 1.5, 0]
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
  >
    <motion.path 
      d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
      animate={{ 
        fill: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)'] 
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    />
  </motion.svg>
);

const WavePattern = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden opacity-15">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 140" preserveAspectRatio="none">
      <path fill="white" fillOpacity="0.9" d="M0,64L40,80C80,96,160,128,240,128C320,128,400,96,480,85.3C560,75,640,85,720,96C800,107,880,117,960,106.7C1040,96,1120,64,1200,48C1280,32,1360,32,1400,32L1440,32L1440,140L1400,140C1360,140,1280,140,1200,140C1120,140,1040,140,960,140C880,140,800,140,720,140C640,140,560,140,480,140C400,140,320,140,240,140C160,140,80,140,40,140L0,140Z"></path>
    </svg>
    <svg className="absolute bottom-0 w-full h-full opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 110" preserveAspectRatio="none">
      <path fill="white" fillOpacity="0.6" d="M0,96L60,80C120,64,240,32,360,32C480,32,600,64,720,69.3C840,75,960,53,1080,42.7C1200,32,1320,32,1380,32L1440,32L1440,140L1380,140C1320,140,1200,140,1080,140C960,140,840,140,720,140C600,140,480,140,360,140C240,140,120,140,60,140L0,140Z"></path>
    </svg>
  </div>
);

const SeasonBanner = () => {
  const targetDate = "2025-05-23T10:00:00+03:00";
  const { days, hours, minutes, seconds, isPassed } = useCountdown(targetDate);
  const [isVisible, setIsVisible] = useState(true);
  const fadeOutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPassed && isVisible) {
      fadeOutTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 7000);
    }

    return () => {
      if (fadeOutTimeoutRef.current) {
        clearTimeout(fadeOutTimeoutRef.current);
      }
    };
  }, [isPassed, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#0A4C8B] to-[#118AB2] h-12 flex justify-center items-center overflow-hidden transition-colors duration-300 hover:bg-opacity-95 shadow-md"
      role="status"
      aria-live="polite"
      initial={{ opacity: 1 }}
      animate={{ opacity: isPassed ? 0 : 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <WavePattern />
      <div className="absolute inset-0 z-10 flex items-center justify-center w-full h-full">
        <div className="px-4 max-w-full text-center">
          {!isPassed ? (
            <p className="text-white/95 font-medium text-sm md:text-base m-0 inline-block">
              Season opens in <span className="text-[#FFD447] font-semibold tracking-wide">{days}d {hours}h {minutes}m {seconds}s</span>
            </p>
          ) : (
            <p className="text-white/95 font-medium text-sm md:text-base m-0 inline-block">
              We're <span className="text-[#FFD447] font-semibold tracking-wider">OPEN</span>! Grab your swimsuit 🏖️
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SeasonBanner;