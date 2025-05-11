/**
 * Room image loader utility
 * Uses Vite's import.meta.glob to properly handle assets at build time
 */

// Import all room images using Vite's glob import
// This ensures proper asset hashing and path rewriting in production builds
const roomImages = {
  junior: import.meta.glob('/attached_assets/junior*.JPG', { eager: true, import: 'default' }),
  twin: import.meta.glob('/attached_assets/twin*.JPG', { eager: true, import: 'default' }),
  ambassador: import.meta.glob('/attached_assets/ambassador*.JPG', { eager: true, import: 'default' })
};

/**
 * Get all images for a specific room type
 * @param roomType The type of room (junior, twin, ambassador)
 * @returns Array of image URLs
 */
export function getRoomImages(roomType: string): string[] {
  if (!roomType || !roomImages[roomType as keyof typeof roomImages]) {
    return [];
  }
  
  // Convert the object of imports to an array of URLs
  return Object.values(roomImages[roomType as keyof typeof roomImages]) as string[];
}

/**
 * Get the number of images available for a room type
 * @param roomType The type of room
 * @returns Number of available images
 */
export function getRoomImageCount(roomType: string): number {
  if (!roomType || !roomImages[roomType as keyof typeof roomImages]) {
    return 0;
  }
  
  return Object.keys(roomImages[roomType as keyof typeof roomImages]).length;
}