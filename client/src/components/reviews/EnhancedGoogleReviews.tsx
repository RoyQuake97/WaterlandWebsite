import { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Star, 
  Calendar, 
  ExternalLink, 
  Quote, 
  ThumbsUp, 
  ChevronLeft, 
  ChevronRight,
  Award,
  MessageSquare,
  Shield,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Review {
  author_name: string;
  rating: number;
  text: string;
  profile_photo_url: string;
  relative_time_description: string;
  time: number;
  id?: string; // Added for our React keys
}

interface ReviewsData {
  name: string;
  rating: number;
  url: string;
  reviews: Review[];
  fetched_at: string;
  is_stale?: boolean;
}

const EnhancedGoogleReviews = () => {
  const [hoveredReview, setHoveredReview] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch reviews data from API
  const { data, isLoading, isError } = useQuery<ReviewsData>({
    queryKey: ['/api/reviews'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Use authentic reviews provided by the client
  const extendedReviews = useMemo(() => {
    if (!data?.reviews) return [];

    // Use all reviews with rating of 4 or higher
    const validReviews = [...data.reviews].filter(review => 
      // Only include reviews with text content and high ratings
      review.text && review.text.trim().length > 0 && review.rating >= 4
    );

    // 3. Create arrays for the two rows
    const multipleReviews: Review[] = [];

    // First row: Use the first 8 reviews
    validReviews.forEach((review, i) => {
      multipleReviews.push({
        ...review,
        id: `review-row1-${i}`,
      });
    });

    // Second row: Use the same reviews in reverse order with different IDs
    [...validReviews].reverse().forEach((review, i) => {
      multipleReviews.push({
        ...review,
        id: `review-row2-${i}`,
      });
    });

    return multipleReviews;
  }, [data]);

  // Total rating stats
  const ratingStats = useMemo(() => {
    if (!data) return { avg: 0, count: 0 };

    return {
      avg: data.rating || 0,
      count: data.reviews?.length || 0
    };
  }, [data]);

  // Format a timestamp to a readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  // Generate review avatar based on name if no photo
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Create two rows of completely different reviews, one going left, one going right
  const reviewRows = useMemo(() => {
    if (extendedReviews.length === 0) return [];

    // Split reviews into two equal rows ensuring each row has completely unique reviews
    const totalReviews = extendedReviews.length;
    const halfIndex = Math.ceil(totalReviews / 2);

    // First row gets first half of reviews
    const firstRowReviews = extendedReviews.slice(0, halfIndex);

    // Second row gets the second half of reviews (no duplicates)
    const secondRowReviews = extendedReviews.slice(halfIndex);

    return [firstRowReviews, secondRowReviews];
  }, [extendedReviews]);

  // Loading state
  if (isLoading) {
    return (
      <div className="py-16 px-4">
        <div className="text-center mb-10">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>

        <div className="relative h-64 mb-16">
          <Skeleton className="h-full w-full rounded-2xl" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(12).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !data) {
    return (
      <div className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto bg-red-50 p-8 rounded-lg border border-red-100">
          <h3 className="text-red-600 text-xl mb-4 font-semibold">Unable to load reviews</h3>
          <p className="text-gray-700">
            We're having trouble loading our Google Reviews. Please check back later to see what our guests have to say about their experiences.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      {/* Header section with stats */}
      <div className="container mx-auto mb-16 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left md:max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-waterland-blue mb-4 font-montserrat">
              Our Guests Love <span className="text-waterland-yellow">Waterland</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              What our 50,000+ seasonal visitors rate us
            </p>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="bg-white px-5 py-3 rounded-full shadow-md flex items-center gap-2 border border-gray-100">
                <div className="text-2xl font-bold text-waterland-blue">4.0</div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                  />
                ))}
                </div>
              </div>

              <a 
                href={data.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-waterland-blue hover:text-blue-700 underline flex items-center gap-1"
              >
                <span>View on Google</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontally Scrollable Reviews */}
      <div className="relative mb-12 overflow-hidden">
        {/* Top curved shape */}
        <div className="absolute top-0 left-0 w-full h-12 bg-white" style={{ borderRadius: '0 0 100% 100%/0 0 100% 100%' }}></div>

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/70 to-white/70 backdrop-blur-sm"></div>

        {/* Overlay gradients for fade effect */}
        <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-white to-transparent z-10"></div>

        {/* Reviews with horizontal scrolling */}
        <div className="py-12">
          {/* Scroll indicator arrows */}
          <div className="text-center text-gray-400 mb-2 hidden md:block">
            <span>← Scroll to see more reviews →</span>
          </div>

          {reviewRows.map((row, rowIndex) => (
            <div 
              key={`row-${rowIndex}`}
              className="w-full overflow-hidden py-4"
            >
              <div className="flex gap-4 md:gap-6"
              style={{
                animation: `${rowIndex % 2 === 0 ? 'scroll' : 'scroll-reverse'} 60s linear infinite`,
                animationPlayState: hoveredReview !== null ? 'paused' : 'running',
                transform: 'translateX(0)',
                willChange: 'transform'
              }}>
                {row.map((review, i) => (
                  <div 
                    key={`row-${rowIndex}-review-${i}`}
                    className="mx-3 flex-shrink-0"
                    onMouseEnter={() => setHoveredReview(rowIndex * 1000 + i)}
                    onMouseLeave={() => setHoveredReview(null)}
                  >
                    <a 
                      href={data.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block cursor-pointer"
                    >
                      <motion.div 
                        className="relative bg-white rounded-xl p-5 shadow-sm border border-gray-100 w-80 review-card flex flex-col hide-scrollbar"
                        whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                        animate={{ 
                          scale: hoveredReview === rowIndex * 1000 + i ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Review header with author info */}
                        <div className="flex items-center gap-2 mb-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-500 to-waterland-blue text-white text-xs font-bold"
                            style={{
                              backgroundImage: review.profile_photo_url ? `url(${review.profile_photo_url})` : undefined,
                              backgroundSize: review.profile_photo_url ? 'cover' : undefined,
                            }}
                          >
                            {!review.profile_photo_url && getInitials(review.author_name)}
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-medium truncate max-w-[160px]">{review.author_name}</div>
                            <div className="flex mt-1">
                              {Array(review.rating).fill(0).map((_, i) => (
                                <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                              ))}
                              {Array(5 - review.rating).fill(0).map((_, i) => (
                                <Star key={i} size={12} className="text-gray-300" />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Review content */}
                        <div className="flex-grow">
                          <p className="text-xs md:text-sm text-gray-600 whitespace-normal break-words line-clamp-6">{review.text}</p>
                        </div>

                        {/* Review footer */}
                        <div className="text-[10px] text-gray-400 mt-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <Calendar size={10} className="inline mr-1" /> 
                            {formatDate(review.time)}
                          </div>
                          <ExternalLink size={10} className="opacity-50" />
                        </div>
                      </motion.div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto text-center px-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <a 
                  href={data.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white px-4 py-2 rounded-full hover:shadow-xl hover:shadow-blue-300/50 transition-all duration-300 font-medium text-sm border border-blue-400/20 hover:scale-105"
                >
                  <MessageSquare size={20} className="text-blue-200" />
                  <span>Leave Your Review on Google</span>
                  <ExternalLink size={16} className="text-blue-200" />
                </a>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Help future guests by sharing your experience</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Custom CSS animations are defined in index.css */}
    </div>
  );
};

export default EnhancedGoogleReviews;