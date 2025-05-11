import React, { useState, useEffect, memo } from 'react';
import { getOptimizedImageUrl, generateSrcSet, getOptimalImageFormat } from '@/lib/imageUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  quality?: number;
}

/**
 * OptimizedImage component that renders images optimized for performance
 * - Uses WebP and AVIF formats with fallback to original
 * - Includes width/height to prevent layout shift
 * - Supports lazy loading (unless priority is true)
 * - Displays a low-res thumbnail while loading
 * - Implements responsive images with srcset and sizes
 */
const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  src,
  alt,
  width,
  height,
  className = '',
  sizes = '100vw',
  priority = false,
  objectFit = 'cover',
  quality = 80
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Extract file info
  const fileExt = src.split('.').pop() || '';
  const baseSrc = src.replace(`.${fileExt}`, '');
  const filename = src.split('/').pop() || '';
  const filenameWithoutExt = filename.replace(`.${fileExt}`, '');
  
  // Path to optimized versions using the utility function
  const optimizedDir = '/images/optimized';
  const bestFormat = getOptimalImageFormat();
  
  // Build paths for different formats
  const optimizedSrc = getOptimizedImageUrl(src, width, quality);
  const optimizedWebp = `${optimizedDir}/${filenameWithoutExt}.webp`;
  const optimizedAvif = `${optimizedDir}/${filenameWithoutExt}.avif`;
  const optimizedThumbnail = `${optimizedDir}/${filenameWithoutExt}-thumb.webp`;
  
  // Generate srcset for responsive images
  const srcSetBase = `${optimizedDir}/${filenameWithoutExt}`;
  const avifSrcSet = generateSrcSet(srcSetBase, 'avif');
  const webpSrcSet = generateSrcSet(srcSetBase, 'webp');
  const jpgSrcSet = generateSrcSet(srcSetBase, 'jpg');
  
  // Use fallback if optimized version doesn't exist (we check during load)
  const useFallback = error;
  
  // Set aspect ratio style to prevent layout shift
  const aspectRatioStyle = width && height ? { aspectRatio: `${width}/${height}` } : {};
  
  // Handle image loaded event
  const handleImageLoaded = () => {
    setLoaded(true);
  };
  
  // Handle error loading optimized version
  const handleError = () => {
    setError(true);
  };
  
  // Preload high-priority images
  useEffect(() => {
    if (priority && !loaded) {
      const imagePreload = new Image();
      imagePreload.src = optimizedSrc;
    }
  }, [priority, optimizedSrc, loaded]);

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={aspectRatioStyle}
    >
      {/* Low-quality thumbnail placeholder - shows immediately */}
      {!loaded && (
        <img
          src={optimizedThumbnail}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-60 transition-opacity"
          width={width ? Math.floor(width / 10) : undefined}
          height={height ? Math.floor(height / 10) : undefined}
          onError={handleError}
          fetchpriority="high"
        />
      )}
      
      {/* Main image with modern formats using picture for format negotiation */}
      <picture>
        {!useFallback && (
          <>
            <source
              srcSet={avifSrcSet}
              type="image/avif"
              sizes={sizes}
            />
            <source
              srcSet={webpSrcSet}
              type="image/webp"
              sizes={sizes}
            />
            <source
              srcSet={jpgSrcSet}
              type="image/jpeg"
              sizes={sizes}
            />
          </>
        )}
        <img
          src={useFallback ? src : optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          className={`w-full h-full transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ objectFit }}
          sizes={sizes}
          onLoad={handleImageLoaded}
          onError={handleError}
        />
      </picture>
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;