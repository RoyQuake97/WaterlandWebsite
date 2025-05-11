/**
 * Utility functions for optimizing image loading and display
 */

/**
 * Generate srcset for responsive images
 * @param basePath Base path without extension
 * @param extension File extension (e.g., 'jpg', 'webp')
 * @param sizes Array of image widths for responsive loading
 * @returns Formatted srcset string
 */
export function generateSrcSet(
  basePath: string,
  extension: string = 'webp',
  sizes: number[] = [640, 768, 1024, 1280, 1536]
): string {
  return sizes
    .map(size => `${basePath}-${size}.${extension} ${size}w`)
    .join(', ');
}

/**
 * Generate a blurhash placeholder URL for images
 * Blurhash is a compact representation of a placeholder image
 * @param width Width of the placeholder
 * @param height Height of the placeholder
 * @param hash The blurhash string
 * @returns Data URL for the placeholder
 */
export function blurhashToDataURL(
  width: number,
  height: number,
  hash: string
): string {
  // For now we return a simple gradient as placeholder
  // In a full implementation, this would decode the blurhash
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3C/svg%3E`;
}

/**
 * Choose the optimal image format based on browser support
 * @returns The best supported image format for the current browser
 */
export function getOptimalImageFormat(): 'avif' | 'webp' | 'jpg' {
  if (typeof window === 'undefined') {
    return 'webp'; // Default for SSR
  }
  
  // Check for AVIF support
  const avifSupport = 
    'HTMLPictureElement' in window &&
    document.createElement('picture').style.hasOwnProperty('objectPosition');
  
  // Check for WebP support
  const webpSupport = !!(
    document.createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0
  );
  
  if (avifSupport) return 'avif';
  if (webpSupport) return 'webp';
  return 'jpg';
}

/**
 * Process image URL to add optimization parameters
 * @param url Original image URL
 * @param width Desired width
 * @param quality Quality level (0-100)
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  url: string,
  width?: number,
  quality: number = 75
): string {
  // Check if this is already an optimized URL
  if (url.includes('/images/optimized/')) {
    return url;
  }
  
  // Extract filename without extension
  const filename = url.split('/').pop() || '';
  const filenameWithoutExt = filename.split('.')[0];
  
  // Determine best format
  const format = getOptimalImageFormat();
  
  // Build optimized path
  let optimizedUrl = `/images/optimized/${filenameWithoutExt}.${format}`;
  
  // Add width suffix if specified
  if (width && width > 0) {
    // Find the nearest size in common breakpoints
    const breakpoints = [640, 768, 1024, 1280, 1536, 1920];
    const nearestWidth = breakpoints.reduce((prev, curr) => {
      return Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev;
    });
    
    optimizedUrl = `/images/optimized/${filenameWithoutExt}-${nearestWidth}.${format}`;
  }
  
  return optimizedUrl;
}