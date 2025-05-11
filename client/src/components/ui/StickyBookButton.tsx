import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface StickyBookButtonProps {
  onClick: () => void;
}

const StickyBookButton = ({ onClick }: StickyBookButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down 300px
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 300);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Don't render on desktop
  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={onClick}
            className="w-full max-w-xs py-6 text-lg font-bold shadow-lg bg-gradient-to-r from-waterland-blue to-waterland-lightblue hover:from-waterland-lightblue hover:to-waterland-blue text-white rounded-full"
          >
            Book Now
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyBookButton;