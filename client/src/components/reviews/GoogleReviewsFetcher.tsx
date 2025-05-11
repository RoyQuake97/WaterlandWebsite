import { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Star, 
  Clock, 
  ExternalLink, 
  ChevronDown, 
  Heart, 
  Quote, 
  ThumbsUp, 
  ChevronLeft, 
  ChevronRight,
  Calendar 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import './GoogleReviewsFetcher.css';

interface Review {
  author_name: string;
  rating: number;
  text: string;
  profile_photo_url: string;
  relative_time_description: string;
  time: number;
}

interface ReviewsData {
  name: string;
  rating: number;
  url: string;
  reviews: Review[];
  fetched_at: string;
  is_stale?: boolean;
}

const INITIAL_REVIEWS_COUNT = 8;
const REVIEWS_PER_LOAD = 4;
const MAX_MOBILE_ITEMS = 4;

// Text shortener with animated "read more"
const ReviewText = ({ 
  text, 
  initialLimit = 140 
}: { 
  text: string, 
  initialLimit?: number 
}) => {
  const [expanded, setExpanded] = useState(false);
  const needsExpansion = text.length > initialLimit;
  
  return (
    <div className="review-text mt-2 relative">
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={{ opacity: 0, height: initialLimit }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: initialLimit }}
            transition={{ duration: 0.3 }}
          >
            {text}
            {needsExpansion && (
              <button 
                onClick={() => setExpanded(false)}
                className="review-read-more-button"
              >
                Show less
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {text.length > initialLimit ? `${text.substring(0, initialLimit)}...` : text}
            {needsExpansion && (
              <button 
                onClick={() => setExpanded(true)}
                className="review-read-more-button"
              >
                Read more
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GoogleReviewsFetcher = () => {
  const [visibleReviews, setVisibleReviews] = useState(INITIAL_REVIEWS_COUNT);
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, boolean>>({});
  const [activeDot, setActiveDot] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the viewport is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const { data, isLoading, isError } = useQuery<ReviewsData>({
    queryKey: ['/api/reviews'],
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  
  // Filter and sort reviews - prioritize 4+ star reviews
  const sortedReviews = useMemo(() => {
    if (!data?.reviews) return [];
    
    // Filter to get high-quality reviews (4+ stars)
    return [...data.reviews]
      .filter(review => review.rating >= 4)
      .sort((a, b) => {
        // First by rating (highest first)
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        // Then by time (newest first)
        return b.time - a.time;
      });
  }, [data]);
  
  // Use this when we know data is definitely available (in the rendered UI)
  const safeData = data as ReviewsData;

  // Format date in a more natural way
  const formatRelativeTime = (relativeTimeDesc: string, timestamp: number): string => {
    const now = new Date();
    const reviewDate = new Date(timestamp * 1000);
    const diffMonths = (now.getMonth() - reviewDate.getMonth()) + 
                       (now.getFullYear() - reviewDate.getFullYear()) * 12;
    
    if (relativeTimeDesc.includes('week') || relativeTimeDesc.includes('day') || relativeTimeDesc.includes('hour')) {
      // For recent reviews, use simplified language
      if (relativeTimeDesc.includes('a week')) return 'Last week';
      if (relativeTimeDesc.includes('days')) return 'This month';
      return relativeTimeDesc;
    } else if (diffMonths <= 3) {
      // Last quarter
      return `${reviewDate.toLocaleString('default', { month: 'long' })} ${reviewDate.getFullYear()}`;
    } else {
      // Older reviews - show season + year
      const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];
      const month = reviewDate.getMonth();
      const season = seasons[Math.floor(month / 3) % 4];
      return `${season} ${reviewDate.getFullYear()}`;
    }
  };
  
  const loadMoreReviews = () => {
    if (data) {
      setVisibleReviews(prev => Math.min(prev + REVIEWS_PER_LOAD, sortedReviews.length));
    }
  };
  
  // Improved star rating display with half-stars support
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      // Determine star type: full, half, or empty
      let starType = 'star-empty';
      if (rating >= i + 1) {
        starType = 'star-filled';
      } else if (rating >= i + 0.5) {
        starType = 'star-half';
      }
      
      return (
        <Star key={i} className={`h-4 w-4 ${starType}`} />
      );
    });
  };

  // Handle mobile carousel navigation
  const scrollToReview = (index: number) => {
    if (!carouselRef.current) return;
    
    const reviewsPerPage = Math.min(MAX_MOBILE_ITEMS, sortedReviews.length);
    const totalDots = Math.ceil(sortedReviews.length / reviewsPerPage);
    
    if (index < 0) index = totalDots - 1;
    if (index >= totalDots) index = 0;
    
    setActiveDot(index);
    
    const reviewCards = carouselRef.current.querySelectorAll('.review-card');
    if (reviewCards.length > 0) {
      const targetCard = reviewCards[index * reviewsPerPage];
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  };

  // Handle "Was this helpful?" clicks
  const markAsHelpful = (reviewIndex: number) => {
    setHelpfulReviews(prev => ({
      ...prev,
      [reviewIndex]: !prev[reviewIndex]
    }));
  };
  
  // Featured review (first 5-star review)
  const featuredReview = sortedReviews.find(review => review.rating === 5);
  
  return (
    <div className="google-reviews-section">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-waterland-blue">What Our Guests Say</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Read authentic reviews from our visitors who have experienced Waterland Resort & Waterpark.
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="review-card-skeleton">
              <div className="flex items-center mb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-3 flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600">
            Unable to load reviews at this time. Please try again later.
          </p>
        </div>
      ) : (
        <div>
          {/* Rating summary with Google Maps link */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center bg-white px-6 py-4 rounded-xl shadow-md border border-gray-100">
              <div className="star-rating mr-3">
                {renderStars(safeData.rating)}
              </div>
              <span className="font-semibold text-lg">{safeData.rating.toFixed(1)}/5</span>
              <span className="mx-3 text-gray-300">|</span>
              <a 
                href={safeData.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-waterland-blue hover:text-waterland-lightblue flex items-center"
              >
                <span className="mr-1.5 hidden sm:inline">View on Google Maps</span>
                <span className="mr-1.5 sm:hidden">Google Maps</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* Schema.org Microdata for SEO */}
          <div itemScope itemType="https://schema.org/LocalBusiness" style={{ display: 'none' }}>
            <span itemProp="name">Waterland Resort & Waterpark</span>
            <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
              <span itemProp="ratingValue">{safeData.rating}</span>/
              <span itemProp="bestRating">5</span> stars based on
              <span itemProp="reviewCount">{safeData.reviews.length}</span> reviews
            </div>
            {sortedReviews.slice(0, 3).map((review, i) => (
              <div key={i} itemProp="review" itemScope itemType="https://schema.org/Review">
                <div itemProp="author" itemScope itemType="https://schema.org/Person">
                  <span itemProp="name">{review.author_name}</span>
                </div>
                <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                  <span itemProp="ratingValue">{review.rating}</span>/
                  <span itemProp="bestRating">5</span>
                </div>
                <span itemProp="reviewBody">{review.text}</span>
              </div>
            ))}
          </div>
          
          {/* Featured review (if available) */}
          {featuredReview && (
            <div className="mb-12 bg-white rounded-xl shadow-md p-6 border border-gray-100 mx-auto max-w-3xl">
              <div className="flex items-center mb-4">
                <a 
                  href={safeData.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="review-author-avatar mr-4"
                  style={{ backgroundImage: `url(${featuredReview.profile_photo_url})` }}
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{featuredReview.author_name}</h3>
                  <div className="flex items-center mt-1">
                    <div className="star-rating mr-2">
                      {renderStars(featuredReview.rating)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      <span>
                        {formatRelativeTime(featuredReview.relative_time_description, featuredReview.time)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-waterland-blue/10 absolute right-8 top-8">
                <Quote className="h-16 w-16" />
              </div>
              <blockquote className="mt-4 text-lg text-gray-700 italic relative z-10">
                "{featuredReview.text}"
              </blockquote>
            </div>
          )}
          
          {/* Mobile Carousel View */}
          {isMobile && (
            <div className="md:hidden mb-12">
              <div className="reviews-carousel" ref={carouselRef}>
                <div className="reviews-carousel-inner">
                  {sortedReviews.slice(0, visibleReviews).map((review, index) => (
                    <ReviewCard 
                      key={index} 
                      review={review} 
                      index={index}
                      formatTime={formatRelativeTime}
                      isHelpful={helpfulReviews[index]}
                      onMarkHelpful={() => markAsHelpful(index)}
                      url={safeData.url}
                    />
                  ))}
                </div>
              </div>
              
              {/* Carousel Navigation */}
              <div className="flex justify-center items-center mt-6 gap-4">
                <button 
                  onClick={() => scrollToReview(activeDot - 1)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                
                <div className="carousel-nav">
                  {Array.from({ length: Math.ceil(sortedReviews.length / MAX_MOBILE_ITEMS) }).map((_, i) => (
                    <button
                      key={i}
                      className={`carousel-nav-dot ${i === activeDot ? 'active' : ''}`}
                      onClick={() => scrollToReview(i)}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={() => scrollToReview(activeDot + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}
          
          {/* Desktop Grid View */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedReviews.slice(0, visibleReviews).map((review, index) => (
              <ReviewCard 
                key={index} 
                review={review} 
                index={index}
                formatTime={formatRelativeTime}
                isHelpful={helpfulReviews[index]}
                onMarkHelpful={() => markAsHelpful(index)}
                url={safeData.url}
              />
            ))}
          </div>
          
          {/* Load More Reviews button */}
          {sortedReviews.length > visibleReviews && (
            <div className="text-center mt-10">
              <Button 
                onClick={loadMoreReviews} 
                variant="outline"
                className="flex items-center gap-2 border-waterland-blue text-waterland-blue hover:bg-waterland-blue/10 px-6 py-5"
              >
                Load More Reviews
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {/* "Write a Review" button */}
          <div className="text-center mt-4">
            <a 
              href={`${safeData.url}#lrd=true`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-gray-600 hover:text-waterland-blue hover:underline mt-2"
            >
              Write your own review on Google
            </a>
          </div>
          
          {/* Data staleness warning */}
          {safeData.is_stale && (
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500 italic">
                * This data was loaded from cache and may not be the most current.
              </p>
            </div>
          )}
          
          {/* Last updated timestamp */}
          <div className="text-center mt-10 text-sm text-gray-500">
            <p>Last updated: {new Date(safeData.fetched_at).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Extracted ReviewCard component for better organization
const ReviewCard = ({ 
  review, 
  index, 
  formatTime, 
  isHelpful, 
  onMarkHelpful,
  url
}: { 
  review: Review, 
  index: number,
  formatTime: (relativeTime: string, timestamp: number) => string,
  isHelpful?: boolean,
  onMarkHelpful: () => void,
  url: string
}) => {
  const [expanded, setExpanded] = useState(false);
  const needsExpansion = review.text.length > 140;
  
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index % 4 * 0.1 }}
      className="review-card"
    >
      {/* Rating badge */}
      <div className={`rating-badge ${review.rating === 5 ? 'rating-perfect' : ''}`}>
        <div className="flex items-center">
          <span className="font-bold mr-1">{review.rating}</span>
          <Star className="h-3 w-3 fill-current" />
        </div>
        {review.rating === 5 && <Heart className="h-3 w-3 ml-1 fill-current" />}
      </div>
      
      {/* User info with clickable avatar */}
      <div className="flex items-center mb-4">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="review-author-avatar"
          style={{ backgroundImage: `url(${review.profile_photo_url})` }}
          aria-label={`View ${review.author_name}'s Google profile`}
        />
        <div className="ml-3 overflow-hidden">
          <h4 className="font-medium text-gray-800 truncate">{review.author_name}</h4>
          <div className="flex items-center text-xs text-gray-500 mt-0.5">
            <Calendar className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span className="truncate">
              {formatTime(review.relative_time_description, review.time)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Review text with improved read more */}
      <div className="review-text mt-2 relative">
        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              initial={{ opacity: 0, height: 140 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 140 }}
              transition={{ duration: 0.3 }}
            >
              {review.text}
              {needsExpansion && (
                <button 
                  onClick={() => setExpanded(false)}
                  className="review-read-more-button"
                >
                  Show less
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {review.text.length > 140 ? `${review.text.substring(0, 140)}...` : review.text}
              {needsExpansion && (
                <button 
                  onClick={() => setExpanded(true)}
                  className="review-read-more-button"
                >
                  Read more
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Was this helpful? button */}
      <div className="review-feedback mt-auto pt-4">
        <button 
          onClick={onMarkHelpful}
          className={isHelpful ? 'active' : ''}
          aria-label="Mark as helpful"
        >
          <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
          <span>{isHelpful ? 'Helpful' : 'Was this helpful?'}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default GoogleReviewsFetcher;