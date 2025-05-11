import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, CloudSun, CloudFog, Snowflake, CloudLightning } from 'lucide-react';

type ForecastDay = {
  date: string;
  day: string;
  temp: number;
  description: string;
  icon: string;
};

type ForecastResponse = {
  forecast: ForecastDay[];
};

const ForecastWidget = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, isLoading, isError } = useQuery<ForecastResponse>({
    queryKey: ['/api/weather/forecast'],
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: isMounted,
  });

  const getWeatherIcon = (iconCode: string) => {
    // Maps OpenWeatherMap icon codes to Lucide icons
    const iconMap: Record<string, JSX.Element> = {
      '01d': <Sun className="h-4 w-4 text-yellow-500" />,
      '01n': <Sun className="h-4 w-4 text-yellow-300" />,
      '02d': <CloudSun className="h-4 w-4 text-blue-400" />,
      '02n': <CloudSun className="h-4 w-4 text-blue-300" />,
      '03d': <Cloud className="h-4 w-4 text-gray-400" />,
      '03n': <Cloud className="h-4 w-4 text-gray-400" />,
      '04d': <Cloud className="h-4 w-4 text-gray-500" />,
      '04n': <Cloud className="h-4 w-4 text-gray-500" />,
      '09d': <CloudRain className="h-4 w-4 text-blue-500" />,
      '09n': <CloudRain className="h-4 w-4 text-blue-500" />,
      '10d': <CloudRain className="h-4 w-4 text-blue-600" />,
      '10n': <CloudRain className="h-4 w-4 text-blue-600" />,
      '11d': <CloudLightning className="h-4 w-4 text-yellow-600" />,
      '11n': <CloudLightning className="h-4 w-4 text-yellow-600" />,
      '13d': <Snowflake className="h-4 w-4 text-blue-200" />,
      '13n': <Snowflake className="h-4 w-4 text-blue-200" />,
      '50d': <CloudFog className="h-4 w-4 text-gray-400" />,
      '50n': <CloudFog className="h-4 w-4 text-gray-400" />,
    };

    return iconMap[iconCode] || <Sun className="h-4 w-4 text-yellow-500" />;
  };

  const getEmoji = (iconCode: string) => {
    // Maps OpenWeatherMap icon codes to emoji for a simpler alternative
    const emojiMap: Record<string, string> = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '⛅',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌦️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️',
    };

    return emojiMap[iconCode] || '☀️';
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-white/80 rounded-md text-xs animate-pulse">
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (isError || !data?.forecast || data.forecast.length === 0) {
    return null; // Hide on error
  }

  return (
    <motion.div 
      className="flex items-center justify-center space-x-2 px-3 py-1 bg-white/80 rounded-md text-xs shadow-sm mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {data.forecast.map((day, index) => (
        <motion.div 
          key={day.date}
          className="flex items-center space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.2 }}
        >
          <span className="font-medium whitespace-nowrap">
            {getEmoji(day.icon)} {day.temp}°C {index === 0 ? 'Today' : day.day}
          </span>
          {index < data.forecast.length - 1 && (
            <span className="text-gray-300 mx-1">|</span>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ForecastWidget;