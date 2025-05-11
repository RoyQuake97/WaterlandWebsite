// Import image paths from constants file
import { ATTRACTION_IMAGES } from './AttractionImages';

export interface AttractionData {
  key: string;
  title: string;
  shortDescription: string;
  color: string;
  thumbnailImage: string;
  comingSoon?: boolean;
  action?: {
    text: string;
    href: string;
  };
}

export const attractionsData: Record<string, AttractionData> = {
  "waterpark-slides": {
    key: "waterpark-slides",
    title: "Waterpark & Slides",
    shortDescription: "Thrills for Every Age",
    color: "#35b9e6", // Light aqua blue
    thumbnailImage: ATTRACTION_IMAGES.waterpark
  },
  "kids-waterhouse": {
    key: "kids-waterhouse",
    title: "Kids Waterhouse",
    shortDescription: "Designed Just for Kids",
    color: "#F55CA7", // Bright pink
    thumbnailImage: ATTRACTION_IMAGES.kids
  },
  "vip-pool": {
    key: "vip-pool",
    title: "VIP Pool & Pool Bar",
    shortDescription: "Your Exclusive Oasis",
    color: "#1683BF", // Waterland blue
    thumbnailImage: ATTRACTION_IMAGES.vipPool
  },
  "resort-hotel": {
    key: "resort-hotel",
    title: "Resort Hotel",
    shortDescription: "Stay Where the Fun Never Ends",
    color: "#4DB848", // Palm green
    thumbnailImage: ATTRACTION_IMAGES.hotel,
    action: {
      text: "View Rooms & Book Stay",
      href: "/hotel"
    }
  },
  "harbor-restaurant": {
    key: "harbor-restaurant",
    title: "Harbor Restaurant",
    shortDescription: "Fresh, Casual Dining",
    color: "#F9BE00", // Bright yellow
    thumbnailImage: ATTRACTION_IMAGES.harbor,
    action: {
      text: "View Menu",
      href: "/menu"
    }
  },
  "boutique-shop": {
    key: "boutique-shop",
    title: "Boutique Shop",
    shortDescription: "Grab What You Forgot",
    color: "#912569", // Purple
    thumbnailImage: ATTRACTION_IMAGES.boutique
  },
  "dessert-bar": {
    key: "dessert-bar",
    title: "Dessert & Snack Bar",
    shortDescription: "Sweet Treats Coming Soon",
    color: "#F78E24", // Orange
    thumbnailImage: ATTRACTION_IMAGES.dessert,
    comingSoon: true
  }
};

// Create an array version for easier mapping
export const attractionsArray = Object.values(attractionsData);