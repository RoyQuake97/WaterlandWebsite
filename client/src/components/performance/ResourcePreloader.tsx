import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { getPreloadAssetsForRoute } from '@/config/preloadConfig';
import { preloadImage, preloadVideo, getConnectionQuality, runWhenIdle } from '@/lib/resourceLoader';

/**
 * ResourcePreloader - Intelligently preloads page resources based on current route
 * This component preloads critical assets for the current page to improve
 * perceived performance and reduce layout shifts.
 */
const ResourcePreloader = () => {
  const [location] = useLocation();
  const connectionQuality = getConnectionQuality();
  
  useEffect(() => {
    // Get assets to preload for current route
    const assetsToPreload = getPreloadAssetsForRoute(location);
    
    // Function to handle preloading
    const preloadAssets = () => {
      // Fast connections: preload everything
      if (connectionQuality === 'fast') {
        // Preload images
        assetsToPreload.images.forEach(image => {
          preloadImage(image);
        });
        
        // Preload videos
        assetsToPreload.videos.forEach(video => {
          preloadVideo(video.src, video.type);
        });
      } 
      // Medium connections: preload only essential images
      else if (connectionQuality === 'medium') {
        // Only preload the first few images
        assetsToPreload.images.slice(0, 3).forEach(image => {
          preloadImage(image);
        });
        
        // Only preload first video if it exists
        if (assetsToPreload.videos.length > 0) {
          preloadVideo(assetsToPreload.videos[0].src, assetsToPreload.videos[0].type);
        }
      }
      // Slow connections: minimal preloading
      else {
        // Only preload the first image if it exists
        if (assetsToPreload.images.length > 0) {
          preloadImage(assetsToPreload.images[0]);
        }
      }
    };

    // Run preload when browser is idle to avoid blocking main thread
    runWhenIdle(preloadAssets);
    
    // No cleanup needed as preload links remain in the document head
  }, [location, connectionQuality]);

  // This is a utility component that doesn't render anything
  return null;
};

export default ResourcePreloader;