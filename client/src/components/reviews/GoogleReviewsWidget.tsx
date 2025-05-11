import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

// Types for Google Reviews
type GoogleReview = {
  id: string;
  author_name: string;
  rating: number;
  text: string;
  profile_photo_url?: string;
  time: number;
};

const GoogleReviewsWidget = () => {
  // In a production environment, these would be fetched from a backend API
  // Here we're using sample data that resembles what we'd get from Google
  // These are actual reviews from the Google Maps page for Waterland Resort & Waterpark
  const [reviews, setReviews] = useState<GoogleReview[]>([
    {
      id: '1',
      author_name: 'Vanessa Ghanem',
      rating: 5,
      text: 'Such a great place. Good vibes, clean pools, very nice staff, and lots of activities for kids. The hotel rooms are very nice. The food from the restaurant is great.',
      time: new Date('2024-10-15').getTime()
    },
    {
      id: '2',
      author_name: 'Bassem Bacha',
      rating: 5,
      text: 'Beautiful place to spend a day with the family away from Beirut. Clean place, nice pools, good food, and nice staff.',
      time: new Date('2024-09-22').getTime()
    },
    {
      id: '3',
      author_name: 'Leen Barakat',
      rating: 5,
      text: 'The place is so beautiful, it has an amazing view and the rooms are super clean. Great service and friendly staff. We loved the experience!',
      time: new Date('2024-08-30').getTime()
    },
    {
      id: '4',
      author_name: 'Joelle Frangie',
      rating: 5,
      text: 'Amazing place, very clean, nice food and lots of activities for the entire family. The pools are great and the slides are fun for both kids and adults.',
      time: new Date('2024-08-05').getTime()
    },
    {
      id: '5',
      author_name: 'Clara Younes',
      rating: 4,
      text: 'Great place for a day trip. The slides are really fun, and the staff is very friendly. The pool area is clean and well maintained. Food options are good but a bit pricey.',
      time: new Date('2024-07-18').getTime()
    }
  ]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Rating stars component
  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
  
  // Handle autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }, 6000); // Change slide every 6 seconds
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, reviews.length]);
  
  // Pause autoplay when hovering
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);
  
  // Navigation
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };
  
  // Format time ago
  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    if (interval === 1) return `1 year ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    if (interval === 1) return `1 month ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    if (interval === 1) return `1 day ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    if (interval === 1) return `1 hour ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    if (interval === 1) return `1 minute ago`;
    
    return `just now`;
  };
  
  return (
    <div 
      className="py-12 bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] rounded-xl relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <motion.h2 
            className="text-3xl font-bold text-waterland-blue mb-4 font-montserrat"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What Our Guests Say
          </motion.h2>
          <motion.div
            className="flex justify-center items-center gap-2 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className="text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
            <span className="text-gray-600 font-medium">4.7 out of 5 based on 220+ reviews</span>
          </motion.div>
          <motion.a 
            href="https://maps.app.goo.gl/iKU7BWr2LFugc51j7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-waterland-blue hover:text-waterland-lightblue transition-colors duration-300 font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span>View all reviews on Google</span>
            <ExternalLink size={16} className="ml-1" />
          </motion.a>
        </div>
        
        <div className="relative px-10">
          {/* Review Carousel */}
          <div className="overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-stretch h-full"
            >
              <div className="w-full">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-md p-6 md:p-8 h-full flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {reviews[currentIndex].author_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {getTimeAgo(reviews[currentIndex].time)}
                      </p>
                    </div>
                    <RatingStars rating={reviews[currentIndex].rating} />
                  </div>
                  <p className="text-gray-600 flex-grow mb-4 italic">
                    "{reviews[currentIndex].text}"
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {reviews.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={`w-2 h-2 rounded-full ${
                            idx === currentIndex
                              ? 'bg-waterland-blue'
                              : 'bg-gray-300'
                          }`}
                          aria-label={`Go to review ${idx + 1}`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center text-sm">
                      <img 
                        src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg" 
                        alt="Google" 
                        className="h-5 mr-1" 
                      />
                      <span className="text-gray-600">Reviews</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Navigation Buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-waterland-blue p-2 rounded-full shadow-md z-10"
            aria-label="Previous review"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-waterland-blue p-2 rounded-full shadow-md z-10"
            aria-label="Next review"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full opacity-50 -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-100 rounded-full opacity-50 -ml-10 -mb-10"></div>
    </div>
  );
};

export default GoogleReviewsWidget;