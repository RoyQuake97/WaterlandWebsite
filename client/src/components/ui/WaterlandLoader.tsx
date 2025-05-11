
import React from 'react';
import { motion } from 'framer-motion';

interface WaterlandLoaderProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const WaterlandLoader: React.FC<WaterlandLoaderProps> = ({ 
  message = "Just a splash away...", 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: "w-32",
    medium: "w-48",
    large: "w-64"
  };

  const textSizeClasses = {
    small: "text-xs mt-1",
    medium: "text-base mt-3",
    large: "text-lg mt-4"
  };

  // Loading bar animation
  const loadingBarVariants = {
    initial: { 
      width: "0%",
      background: "linear-gradient(90deg, #0A4C8B 0%, #35b9e6 0%, #4db848 0%)"
    },
    animate: {
      width: "100%",
      background: [
        "linear-gradient(90deg, #0A4C8B 0%, #0A4C8B 33%, #35b9e6 33%, #35b9e6 66%, #4db848 66%, #4db848 100%)",
        "linear-gradient(90deg, #0A4C8B 0%, #0A4C8B 100%, #35b9e6 100%, #35b9e6 100%, #4db848 100%, #4db848 100%)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        background: {
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }
      }
    }
  };

  // Wave ripple effect behind the loading bar
  const rippleVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.1, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${sizeClasses[size]} h-2 bg-gray-100 rounded-full overflow-hidden`}>
        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 bg-waterland-blue/10 rounded-full"
          variants={rippleVariants}
          animate="animate"
        />
        
        {/* Loading bar */}
        <motion.div
          className="absolute h-full rounded-full"
          variants={loadingBarVariants}
          initial="initial"
          animate="animate"
        />
      </div>
      
      {/* Loading message */}
      {size !== 'small' && (
        <motion.p 
          className={`text-waterland-blue font-medium ${textSizeClasses[size]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default WaterlandLoader;
