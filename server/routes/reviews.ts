import express, { Request, Response } from 'express';
import { hardcodedReviews } from './hardcoded_reviews';
import NodeCache from 'node-cache';

const reviewsCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
const router = express.Router();

// GET /api/reviews - Return authentic reviews from hardcoded collection
router.get('/', async (req: Request, res: Response) => {
  try {
    // Check cache first
    const cachedReviews = reviewsCache.get('reviews');

    if (cachedReviews) {
      console.log('Serving reviews from cache');
      return res.json(cachedReviews);
    }

    const reviews = {
      name: 'Waterland Resort & Waterpark',
      rating: 5.0,
      reviews: hardcodedReviews,
      user_ratings_total: hardcodedReviews.length,
      url: 'https://g.page/r/CYGRF54EUXEEEAg/review'
    };

    // Cache the result
    reviewsCache.set('reviews', reviews);

    return res.json(reviews);
  } catch (error) {
    console.error('Error in reviews endpoint:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch reviews',
      fallbackReviews: hardcodedReviews 
    });
  }
});

// GET /api/reviews/hardcoded - Return only hardcoded reviews (for testing)
router.get('/hardcoded', (req: Request, res: Response) => {
  return res.json({
    name: 'Waterland Resort & Waterpark',
    rating: 4.7,
    reviews: hardcodedReviews,
    user_ratings_total: hardcodedReviews.length,
    url: 'https://g.page/r/CYGRF54EUXEEEAg/review'
  });
});

export default router;