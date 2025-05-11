/**
 * Preload configuration for different pages
 * This configures which assets should be preloaded based on the current route
 */

// Base assets that should be preloaded on all pages
export const basePreloadAssets = {
  images: [
    // Logo images and essential UI elements
    '/images/logo.png',
    '/images/waterland-logo-small.png'
  ],
  fonts: [
    // Critical fonts preloaded via PreloadFonts component
  ],
  scripts: [
    // No critical scripts to preload
  ]
};

// Page-specific preload assets
export const pagePreloadAssets: Record<string, {
  images: string[];
  videos: Array<{ src: string; type: string }>;
  scripts: string[];
}> = {
  // Home page preloads
  '/': {
    images: [
      '/images/placeholder-small.jpg',
      '/images/attractions/waterpark-slides.jpg',
      '/images/attractions/kids-pool.jpg',
      '/images/attractions/vip-cabana.jpg',
    ],
    videos: [
      { src: '/videos/hero-video.webm', type: 'video/webm' },
      { src: '/videos/hero-video.mp4', type: 'video/mp4' }
    ],
    scripts: []
  },
  
  // Hotel page preloads
  '/hotel': {
    images: [
      '/images/hotel/junior-room-1.jpg',
      '/images/hotel/twin-room-1.jpg',
      '/images/hotel/booking-bg.jpg'
    ],
    videos: [],
    scripts: []
  },
  
  // Menu page preloads
  '/menu': {
    images: [
      '/images/menu/restaurant-hero.jpg',
      '/images/menu/menu-bg.jpg'
    ],
    videos: [],
    scripts: []
  }
};

/**
 * Get preload assets for the current route
 * @param path Current route path
 * @returns Asset URLs to preload
 */
export function getPreloadAssetsForRoute(path: string) {
  // Default to base assets
  const assets = {
    images: [...basePreloadAssets.images],
    videos: [] as Array<{ src: string; type: string }>,
    scripts: [...basePreloadAssets.scripts]
  };
  
  // Add page-specific assets if available
  if (pagePreloadAssets[path]) {
    assets.images.push(...pagePreloadAssets[path].images);
    assets.videos.push(...pagePreloadAssets[path].videos);
    assets.scripts.push(...pagePreloadAssets[path].scripts);
  }
  
  return assets;
}