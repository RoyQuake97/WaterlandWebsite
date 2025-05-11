// Import the dessert bar image directly
import DessertBarImage from './DessertBarImage';

// Real image paths from assets folder
export const ATTRACTION_IMAGES = {
  waterpark: "/assets/Slides_waterland.jpg",
  kids: "/assets/Waterhouse_waterland.JPG",
  vipPool: "/assets/VIP_Waterland.jpg",
  hotel: "/assets/Hotel_waterland.jpg",
  harbor: "/assets/Harbor_waterland.jpg",
  boutique: "/assets/shop_waterland.jpg",
  dessert: DessertBarImage() // Direct import from assets
};

// Placeholder image in case any images fail to load
export const PLACEHOLDER_IMAGE = "/assets/VIP_Waterland.jpg";