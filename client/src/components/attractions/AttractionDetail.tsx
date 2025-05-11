import React from 'react';
import { useLocation } from 'wouter';
import { attractionsData, attractionsArray } from './AttractionsData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { PLACEHOLDER_IMAGE } from './AttractionImages';

interface AttractionDetailProps {
  attractionKey: string;
}

// Define types for all possible detail properties
interface BaseAttractionDetails {
  fullDescription: string;
  features: string[];
}

interface WaterAttractionDetails extends BaseAttractionDetails {
  // No additional properties
}

interface FoodAttractionDetails extends BaseAttractionDetails {
  specialties?: string;
  reservations?: string;
}

interface ShopAttractionDetails extends BaseAttractionDetails {
  popularItems: string;
}

interface HotelAttractionDetails extends BaseAttractionDetails {
  bestTimeToBook: string;
  familyOptions: string;
}

type AttractionDetailsType = {
  [key: string]: WaterAttractionDetails | FoodAttractionDetails | ShopAttractionDetails | HotelAttractionDetails;
};

// Detailed attraction content mapping
const attractionDetails: AttractionDetailsType = {
  "waterpark-slides": {
    fullDescription: "Welcome to the heart of the action — our iconic water slides! From steep plunges to swirling tubes, there's something for every thrill-seeker.",
    features: [
      "Non-stop slide operation from 11:30 AM to 5:00 PM",
      "No water depth — all slides land safely in shallow splash zones",
      "Shaded and sunlit seating areas available for parents",
      "Some high slides are not suitable for children under 8"
    ]
  },
  "kids-waterhouse": {
    fullDescription: "Let your little ones splash safely in our sea-themed interactive waterhouse, filled with excitement and color.",
    features: [
      "Ideal for children under 12 years old",
      "No deep water — fully kid-friendly",
      "Constant staff supervision and secure enclosed space",
      "Mini slides, tipping buckets, and splash fun"
    ]
  },
  "vip-pool": {
    fullDescription: "Escape the crowds in our adults-only VIP pool zone — a private, elegant space for quiet sun and premium treatment.",
    features: [
      "Access on a first come, first served basis — no advance booking",
      "In-water bar with refreshing cocktails and smoothies",
      "Towel service and shaded loungers included",
      "Limited spaces available daily"
    ]
  },
  "resort-hotel": {
    fullDescription: "Enjoy the full Waterland experience with a stay at our relaxing on-site hotel. Whether you're here for a weekend getaway or a special event, we've got the perfect room for you.",
    features: [
      "Rooms include free Waterpark access and breakfast",
      "Variety of options for families, couples, and groups",
      "Just steps away from the park, bars, and restaurants"
    ],
    bestTimeToBook: "Sunday to Thursday for better rates",
    familyOptions: "Various room configurations available for families of all sizes"
  },
  "harbor-restaurant": {
    fullDescription: "Take a break from the slides and enjoy a meal with a view at our poolside Harbor Restaurant.",
    features: [
      "Open daily from 10:00 AM to 5:00 PM",
      "Fresh, international menu — no Lebanese food served",
      "Family-friendly seating and poolside ambiance",
      "Drinks, sandwiches, burgers, and more"
    ],
    specialties: "International menu with poolside favorites"
  },
  "dessert-bar": {
    fullDescription: "A sweet new treat is coming to Waterland! Our dessert & snack bar will feature refreshing frozen delights, premium coffee drinks, and tasty snacks perfect for those hot summer days.",
    features: [
      "Premium soft-serve ice cream with toppings bar",
      "Refreshing protein smoothies and fruit shakes",
      "Specialty iced coffees and frozen beverages",
      "Fresh-made crepes and light snacks",
      "Opening Summer 2025"
    ],
    specialties: "Stay tuned for our grand opening celebration with special tastings and promotions!"
  },
  "boutique-shop": {
    fullDescription: "Forgot your towel? Need a quick snack or sunscreen? Our boutique shop has your back.",
    features: [
      "Open from 10:00 AM to 7:00 PM",
      "Swimwear, accessories, beach toys, essentials",
      "Cash only — cards not accepted",
      "Located near the main entrance"
    ],
    popularItems: "Swimwear, accessories, and essentials"
  }
};

const AttractionDetail: React.FC<AttractionDetailProps> = ({ attractionKey }) => {
  const [, setLocation] = useLocation();
  const attraction = attractionsData[attractionKey];
  const details = attractionDetails[attractionKey as keyof typeof attractionDetails];

  // Filter out the current attraction for the related attractions carousel
  const relatedAttractions = attractionsArray.filter(
    item => item.key !== attractionKey
  );

  // Helper functions to check for property existence safely
  

  
  const hasSpecialties = (details: any): details is FoodAttractionDetails => {
    return 'specialties' in details;
  };
  
  const hasPopularItems = (details: any): details is ShopAttractionDetails => {
    return 'popularItems' in details;
  };
  
  const hasReservations = (details: any): details is FoodAttractionDetails => {
    return 'reservations' in details;
  };
  
  const hasTimeToBook = (details: any): details is HotelAttractionDetails => {
    return 'bestTimeToBook' in details;
  };

  // Animation variants for the page
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (!attraction) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center" 
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Attraction not found</h2>
          <Button 
            className="bg-[#0A4C8B] hover:bg-[#083a66]"
            onClick={() => {
              setLocation("/");
              window.scrollTo(0, 0);
            }}
          >
            Return to Home
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white min-h-screen"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Hero Section */}
      <div 
        className="relative w-full h-[40vh] md:h-[60vh] bg-cover bg-center" 
        style={{ 
          backgroundImage: `url(${attraction.thumbnailImage})`,
          backgroundColor: attraction.color 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
        
        {/* Back Button */}
        <div className="container mx-auto px-4 relative z-10">
          <Button 
            variant="ghost" 
            className="mt-6 flex items-center text-white hover:bg-white/20 transition-all" 
            onClick={() => {
              setLocation("/");
              window.scrollTo(0, 0);
            }}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span className="font-medium">Back to Home</span>
          </Button>
        </div>
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{attraction.title}</h1>
            {attraction.comingSoon && (
              <div className="inline-block bg-[#F86AA0] text-white font-semibold py-1 px-3 rounded-full text-sm mb-4">
                COMING SOON
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-waterland-blue mb-5">
            {attraction.shortDescription}
          </h2>
          
          {/* Entry Price Tag for Waterpark Slides and Kids Waterhouse */}
          {(attractionKey === "waterpark-slides" || attractionKey === "kids-waterhouse") && (
            <div className="mb-6">
              <div className="inline-flex items-center px-5 py-3 bg-[#0A4C8B] text-white rounded-lg shadow-md">
                <div className="mr-3 bg-[#FFD447] rounded-full p-2 flex items-center justify-center">
                  <span className="text-[#0A4C8B] font-bold text-xl">$20</span>
                </div>
                <span className="font-medium text-lg">Admission fee per person</span>
              </div>
            </div>
          )}
          
          <p className={`text-xl ${attractionKey === "dessert-bar" ? "text-gray-400 opacity-70" : "text-gray-700"} mb-8 leading-relaxed`}>
            {details?.fullDescription || ""}
          </p>

          {details?.features && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-waterland-blue mb-4">Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {details.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full ${attractionKey === "dessert-bar" ? "bg-gray-300" : "bg-[#FFD447]"} flex items-center justify-center mt-1 mr-3`}>
                      <ChevronRight className="h-4 w-4 text-white" />
                    </div>
                    <span className={`${attractionKey === "dessert-bar" ? "text-gray-400" : "text-gray-700"}`}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">



            
            {details && hasPopularItems(details) && (
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-lg text-waterland-blue mb-2">Popular Items</h3>
                <p className="text-gray-700">{details.popularItems}</p>
              </div>
            )}
            
            {details && hasReservations(details) && (
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-lg text-waterland-blue mb-2">Reservations</h3>
                <p className="text-gray-700">{details.reservations}</p>
              </div>
            )}
            
            
          </div>

          {/* Action Buttons */}
          {attraction.action && (
            <div className="mb-16 flex flex-wrap gap-4">
              <Button 
                className="min-w-40 bg-[#0A4C8B] hover:bg-[#083a66] text-lg py-6" 
                onClick={() => {
                  setLocation(attraction.action?.href || "/");
                  window.scrollTo(0, 0);
                }}
              >
                {attraction.action?.text}
              </Button>
              
              <Button 
                variant="outline" 
                className="min-w-40 text-lg py-6 border-[#0A4C8B] text-[#0A4C8B]" 
                onClick={() => {
                  setLocation("/");
                  window.scrollTo(0, 0);
                }}
              >
                View All Attractions
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Related Attractions Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-waterland-blue mb-6">More to Explore</h2>
          
          <div className="relative">
            <div className="overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex space-x-4 min-w-max">
                {relatedAttractions.map((related) => (
                  <div 
                    key={related.key} 
                    className="w-64 flex-shrink-0 cursor-pointer"
                    onClick={() => {
                      setLocation(`/attraction/${related.key}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div className="relative rounded-xl overflow-hidden shadow-md group transition-all duration-300 hover:shadow-lg">
                      <div 
                        className="w-full h-40 bg-cover bg-center" 
                        style={{ 
                          backgroundImage: `url(${related.thumbnailImage})`,
                          backgroundColor: related.color
                        }}
                      />
                      <div className="p-4 bg-white">
                        <h3 className="text-lg font-semibold mb-1 text-waterland-blue group-hover:text-[#F86AA0] transition-colors">{related.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{related.shortDescription}</p>
                      </div>
                      {related.comingSoon && (
                        <div className="absolute top-3 right-3 bg-[#F86AA0] text-white text-xs font-semibold py-1 px-2 rounded-full">
                          COMING SOON
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AttractionDetail;