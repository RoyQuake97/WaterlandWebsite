import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Component that handles scrolling to top on route change
 * This should be included in the main App component
 */
const ScrollToTop: React.FC = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll to top whenever the location changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  return null;
};

export default ScrollToTop;