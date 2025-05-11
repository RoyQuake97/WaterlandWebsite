import { motion } from "framer-motion";
import { Check, Calendar, Users, CreditCard, Sparkles } from "lucide-react";

interface BookingProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  showConfetti?: boolean;
}

const BookingProgressTracker = ({ currentStep, totalSteps, showConfetti = false }: BookingProgressTrackerProps) => {
  // Calculate progress percentage
  const progress = (currentStep / totalSteps) * 100;
  
  // Define steps data with icons and labels (matches order shown in RoomCard.tsx)
  const steps = [
    { icon: <Users className="h-5 w-5" />, label: "Guests" },
    { icon: <Calendar className="h-5 w-5" />, label: "Dates" },
    { icon: <Users className="h-5 w-5" />, label: "Info" },
    { icon: <Sparkles className="h-5 w-5" />, label: "Confirm" }
  ];

  return (
    <div className="w-full mb-8 px-4">
      {/* Celebration animation when booking is confirmed */}
      {showConfetti && (
        <motion.div 
          className="absolute top-0 left-0 w-full h-full z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="confetti-container">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className={`confetti confetti-${i % 5}`}
                initial={{ 
                  top: "-10%", 
                  left: `${Math.random() * 100}%`, 
                  rotate: 0 
                }}
                animate={{ 
                  top: "100%", 
                  rotate: 360, 
                  left: `${Math.random() * 100}%` 
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2,
                  ease: "easeOut",
                  delay: Math.random() * 0.5
                }}
                style={{
                  position: "absolute",
                  width: `${5 + Math.random() * 10}px`,
                  height: `${5 + Math.random() * 10}px`,
                  borderRadius: Math.random() > 0.5 ? "50%" : "0",
                  backgroundColor: [
                    "#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"
                  ][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      <div className="relative">
        {/* Progress bar container */}
        <div className="overflow-hidden h-2 mb-6 text-xs flex rounded-full bg-gray-100">
          <motion.div 
            className="h-full bg-waterland-blue rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        
        {/* Steps indicators */}
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep - 1;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <motion.div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                    isCompleted 
                      ? "bg-green-500 text-white" 
                      : isCurrent
                        ? "bg-waterland-blue text-white" 
                        : "bg-gray-200 text-gray-500"
                  }`}
                  initial={false}
                  animate={
                    isCompleted 
                      ? { scale: [1, 1.2, 1], backgroundColor: "#10b981" } 
                      : isCurrent
                        ? { scale: [1, 1.1, 1], backgroundColor: "#0ea5e9" }
                        : {}
                  }
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    step.icon
                  )}
                </motion.div>
                <p className={`text-xs font-medium ${
                  isCompleted 
                    ? "text-green-500" 
                    : isCurrent
                      ? "text-waterland-blue" 
                      : "text-gray-500"
                }`}>
                  {step.label}
                </p>
                {isCurrent && (
                  <motion.div
                    className="mt-1 h-1 w-3 rounded-full bg-waterland-blue"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Achievements display */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm font-semibold text-waterland-blue">
            {currentStep === totalSteps 
              ? "Booking Complete!" 
              : `Step ${currentStep} of ${totalSteps}`
            }
          </div>
          <div className="flex items-center">
            {progress >= 25 && (
              <motion.div 
                className="bg-waterland-lightblue/10 rounded-full p-1.5 mr-2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Calendar className="h-4 w-4 text-waterland-blue" />
              </motion.div>
            )}
            {progress >= 50 && (
              <motion.div 
                className="bg-waterland-green/10 rounded-full p-1.5 mr-2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Users className="h-4 w-4 text-waterland-green" />
              </motion.div>
            )}
            {progress >= 75 && (
              <motion.div 
                className="bg-waterland-orange/10 rounded-full p-1.5 mr-2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <CreditCard className="h-4 w-4 text-waterland-orange" />
              </motion.div>
            )}
            {progress >= 100 && (
              <motion.div 
                className="bg-waterland-pink/10 rounded-full p-1.5"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Sparkles className="h-4 w-4 text-waterland-pink" />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingProgressTracker;