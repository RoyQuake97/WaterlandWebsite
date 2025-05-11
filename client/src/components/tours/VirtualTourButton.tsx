import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type VirtualTourButtonProps = {
  className?: string;
  tourUrl?: string;
  buttonText?: string;
  variant?: 'default' | 'outline' | 'ghost';
};

const VirtualTourButton = ({
  className = '',
  tourUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1', // Replace with actual 360 tour URL
  buttonText = 'Take a Virtual Tour',
  variant = 'default'
}: VirtualTourButtonProps) => {
  const [showTour, setShowTour] = useState(false);
  
  const openTour = () => {
    setShowTour(true);
    // Prevent scrolling while tour is open
    document.body.style.overflow = 'hidden';
  };
  
  const closeTour = () => {
    setShowTour(false);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };
  
  return (
    <>
      <Button
        onClick={openTour}
        variant={variant}
        className={`flex items-center gap-2 ${className}`}
      >
        <Video className="h-5 w-5" />
        {buttonText}
      </Button>
      
      <AnimatePresence>
        {showTour && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative w-full max-w-5xl h-[80vh] bg-black rounded-lg shadow-xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={closeTour}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition duration-200"
                  aria-label="Close virtual tour"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <iframe
                src={tourUrl}
                title="Waterland Resort Virtual Tour"
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VirtualTourButton;