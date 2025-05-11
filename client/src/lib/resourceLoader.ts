/**
 * Utility functions for optimizing resource loading
 */

/**
 * Preload a video file with proper priority
 * @param src Video source URL
 * @param type MIME type of the video
 */
export function preloadVideo(src: string, type: string): void {
  // Create a preload link element
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'video';
  link.href = src;
  link.type = type;

  // Add to document head
  document.head.appendChild(link);
}

/**
 * Preload an image with appropriate priority
 * @param src Image source URL
 * @param priority Whether this is a high priority image
 */
export function preloadImage(src: string, priority: 'high' | 'low' = 'low'): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  
  if (priority === 'high') {
    link.setAttribute('fetchpriority', 'high');
  }
  
  document.head.appendChild(link);
}

/**
 * Check if the user has data saver mode enabled
 */
export function isDataSaverEnabled(): boolean {
  return !!(navigator as any).connection?.saveData;
}

/**
 * Get the connection quality estimation
 * @returns 'slow', 'medium', or 'fast'
 */
export function getConnectionQuality(): 'slow' | 'medium' | 'fast' {
  const connection = (navigator as any).connection;
  
  if (!connection) {
    return 'medium';
  }
  
  const type = connection.effectiveType;
  
  if (type === 'slow-2g' || type === '2g') {
    return 'slow';
  } else if (type === '3g') {
    return 'medium';
  } else {
    return 'fast';
  }
}

/**
 * Execute a function when the browser is idle
 * @param callback Function to execute
 * @param timeout Timeout in ms
 */
export function runWhenIdle(callback: () => void, timeout = 2000): void {
  if ('requestIdleCallback' in window) {
    // @ts-ignore - TypeScript doesn't have full types for this API
    window.requestIdleCallback(callback, { timeout });
  } else {
    // Fallback to setTimeout
    setTimeout(callback, 50);
  }
}