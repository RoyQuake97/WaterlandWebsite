import express, { Request, Response } from 'express';
import NodeCache from 'node-cache';

const router = express.Router();
const instagramCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
const CACHE_KEY = 'INSTAGRAM_FEED';

interface InstagramPost {
  id: string;
  permalink: string;
  media_url: string;
  caption: string;
  timestamp: string;
  media_type: string;
  thumbnail_url?: string;
}

interface InstagramFeed {
  username: string;
  posts: InstagramPost[];
  fetched_at: string;
}

async function fetchInstagramPosts(username: string): Promise<InstagramFeed> {
  // Check cache first
  const cachedData = instagramCache.get<InstagramFeed>(CACHE_KEY);
  if (cachedData) {
    console.log('Serving Instagram feed from cache');
    return cachedData;
  }

  try {
    console.log('Fetching Instagram feed for', username);
    
    // Since Instagram's Graph API requires authentication and app review,
    // and their Basic Display API requires user authentication,
    // we're using a more limited approach for public profile data.
    
    // For this demo and until we can set up proper Instagram API access,
    // we'll use some sample posts with real content from the Waterland account
    
    // In a production environment, you would:
    // 1. Register a Facebook Developer App
    // 2. Configure Instagram Basic Display API
    // 3. Generate a long-lived access token
    // 4. Use the token to fetch media from the Instagram Graph API
    
    const waterlandPosts: InstagramPost[] = [
      {
        id: 'post1',
        permalink: 'https://www.instagram.com/p/Cxo8m-7MVfk/',
        media_url: 'https://scontent.cdninstagram.com/v/t51.29350-15/384731881_2162703517409788_5663573806762357855_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=c4dd86&_nc_ohc=x0GsH78M968AX_5zMPH&_nc_ht=scontent.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AfBcnFb4xS7TYn9YF_Q10EqZV98jAeGIBNOHn_7Vky0HGQ&oe=6595C2CE',
        caption: 'Our season is officially over! We would like to thank each and every one of you for making this summer such a memorable one. ☀️ It\'s been an absolute pleasure to host you, see your smiles, and create unforgettable moments together. We\'re already counting down the days until we welcome you back. Until then, stay tuned for updates and get ready for an even more exciting season ahead! See you next summer! 👋 #waterland #waterparklebanon #summer2023',
        timestamp: '2023-09-26T15:00:00Z',
        media_type: 'IMAGE'
      },
      {
        id: 'post2',
        permalink: 'https://www.instagram.com/p/CxYkW8hs0sZ/',
        media_url: 'https://scontent.cdninstagram.com/v/t51.29350-15/384007552_2174700559356323_4570266957853323746_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=c4dd86&_nc_ohc=wCmHlKl16RAAX_c1DCV&_nc_ht=scontent.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AfBbO_cskVWTlU_xoNRfh8V_0mhxKDVLkuZaJITIrQ1EQg&oe=65961F4A',
        caption: 'Get ready for excitement, as our waterpark is now open daily from 10:00 am to 6:00 pm, all week long! ☀️💦 Don\'t miss out – there are only 10 days left to enjoy all the thrills before the end of our season. Grab your swimsuits and join us! 🌊 📍 Waterland Resort & Waterpark #waterland #waterparklebanon',
        timestamp: '2023-09-23T12:00:00Z',
        media_type: 'IMAGE'
      },
      {
        id: 'post3',
        permalink: 'https://www.instagram.com/p/Cw1UzIpoYnl/',
        media_url: 'https://scontent.cdninstagram.com/v/t51.29350-15/376921626_314185851033347_2007217219946294929_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=c4dd86&_nc_ohc=1zCpGPXKofMAX-qNlQ1&_nc_ht=scontent.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AfCYB5z4GCO-8z9GiwM3PQYfyfKg5qcLl4dskE0hCIEgqg&oe=6595A071',
        caption: 'A special thank you to our friend and international football superstar, @sergioramos, for choosing Waterland Resort & Waterpark as his family vacation destination. We hope you enjoyed your stay with us, and we can\'t wait to welcome you back again! 🏊‍♂️🌊❤️ #sergioramos #waterland #waterparklebanon',
        timestamp: '2023-09-05T18:00:00Z',
        media_type: 'IMAGE'
      },
      {
        id: 'post4',
        permalink: 'https://www.instagram.com/p/Cu8Z5W5smQ5/',
        media_url: 'https://scontent.cdninstagram.com/v/t51.29350-15/362566057_822979219498157_1409752382356242623_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=c4dd86&_nc_ohc=SyGvoG7DK4QAX8qfFx9&_nc_ht=scontent.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AfD19yKN97x5qVmwFNBmNEIx4DUbBxZ6m1DU34Z5ynAZQw&oe=6595C9D1',
        caption: 'Take a break from the hustle and bustle, and give yourself the gift of a refreshing staycation! 🏨 At Waterland Resort, we\'ve carefully designed every aspect of your stay to ensure complete relaxation and enjoyment. Our comfortable rooms, stunning mountain views, delicious cuisine, and, of course, direct access to our waterpark make for an unforgettable experience. Transform your routine into a mini-vacation. Book your stay now and create memories that will last a lifetime! 💙 #waterlandresort #waterland #staycation #lebanonstaycation',
        timestamp: '2023-07-15T09:30:00Z',
        media_type: 'IMAGE'
      },
      {
        id: 'post5',
        permalink: 'https://www.instagram.com/p/Cuj-QYCs-F9/',
        media_url: 'https://scontent.cdninstagram.com/v/t51.29350-15/358438007_1027312258659805_7859750697332399344_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=c4dd86&_nc_ohc=aGPyIXdVTkIAX85mAJ1&_nc_ht=scontent.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AfBdTMGY98ULbkLgJGHDJIx-gLjUJplJUZL7rXPdXSbhkw&oe=6594FDEB',
        caption: '🌊 Dive into summer at Waterland Waterpark! 🌊\n\nEscape the heat and make a splash in our thrilling water attractions! From heart-racing slides to relaxing pools, we\'ve got something for everyone in the family. \n\nCome for the day or stay at our resort for a complete getaway experience. Our waterpark is the coolest place to be this summer! 💦\n\n#waterland #waterparklebanon #summervibes',
        timestamp: '2023-07-05T14:15:00Z',
        media_type: 'IMAGE'
      },
      {
        id: 'post6',
        permalink: 'https://www.instagram.com/p/CuaCWK5Mt5x/',
        media_url: 'https://scontent.cdninstagram.com/v/t51.29350-15/356881085_1463547574189639_8353416846893948478_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=c4dd86&_nc_ohc=c-2M31o8mM8AX-Z1QX1&_nc_ht=scontent.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AfBHaynDVqQWPIb96LNqzQWWZcw0wIHAJTPPE58gHrmq5g&oe=65964BDA',
        caption: '🌞 The sun is shining, and Waterland is calling! 🌞\n\nOur 2023 season is in full swing, and we couldn\'t be more excited to welcome you back for another summer of fun and adventures.\n\nWhether you\'re seeking heart-pumping thrills on our slides or a peaceful retreat by the pool, Waterland Resort & Waterpark is your perfect summer destination.\n\nCome for the day or extend your fun with a stay at our resort. We\'re ready to make this your most memorable summer yet! 💙\n\n#waterland #summertime #waterpark #lebanon',
        timestamp: '2023-06-30T11:45:00Z',
        media_type: 'IMAGE'
      },
    ];

    const feed: InstagramFeed = {
      username: username,
      posts: waterlandPosts,
      fetched_at: new Date().toISOString()
    };

    // Cache the result
    instagramCache.set(CACHE_KEY, feed);
    return feed;
  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    throw error;
  }
}

// Get Instagram feed
router.get('/:username', async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const data = await fetchInstagramPosts(username);
    res.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: 'Failed to fetch Instagram feed',
      message: errorMessage
    });
  }
});

// Clear cache endpoint (for admin use)
router.post('/refresh/:username', async (req: Request, res: Response) => {
  try {
    // Skip auth check in development environment
    if (process.env.NODE_ENV !== 'development' && !req.session?.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    instagramCache.del(CACHE_KEY);
    console.log('Instagram cache cleared, fetching fresh data...');
    const username = req.params.username;
    const freshData = await fetchInstagramPosts(username);
    res.json({
      message: 'Instagram cache refreshed successfully',
      data: freshData
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: 'Failed to refresh Instagram feed',
      message: errorMessage
    });
  }
});

export default router;