import { useQuery } from "@tanstack/react-query";
import RoomCard from "@/components/hotel/RoomCard";
import { Room } from "@shared/schema";
import SEO from "@/components/seo/SEO";
import WaterlandLoader from "@/components/ui/WaterlandLoader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import balconyVideo from "@assets/IMG_4062 (1).mov";
import { Calendar, Check, AlertCircle, Sparkles } from "lucide-react";
import hotelImg from "@assets/Hotel_waterland.jpg";

const Hotel = () => {
  const { data: rooms, isLoading, error } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });
  
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const handleVideoLoad = () => {
    console.log("Video data loaded successfully");
    setVideoLoaded(true);
  };

  const handleVideoPlay = () => {
    console.log("Video is now playing");
  };

  // Filter rooms based on active tab
  const filteredRooms = rooms?.filter(room => {
    if (activeTab === "all") return true;
    return room.type === activeTab;
  });

  const roomFeatures = {
    "junior": {
      title: "Junior Room",
      price: "$250",
      highlights: ["Sleeps up to 4", "1 King Bed or 2 Twin Beds", "Balcony with Waterpark View", "35 sqm"],
      idealFor: "Couples or families with 1-2 children"
    },
    "twin": {
      title: "Twin Room",
      price: "$300",
      highlights: ["Sleeps up to 5", "2 Queen Beds", "Larger Balcony", "42 sqm"],
      idealFor: "Families with 2-3 children or groups"
    },
    "ambassador": {
      title: "Ambassador Suite",
      price: "$350+",
      highlights: ["Sleeps up to 6", "1 King + Sofa Bed", "Premium View", "55 sqm"],
      idealFor: "Large families or premium experience seekers"
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <SEO 
        title="Luxury Resort Accommodations in Zgharta"
        description="Book your stay at Waterland Resort's premium rooms. All accommodations include waterpark access, breakfast, and exceptional amenities for a perfect family getaway."
        keywords="hotel lebanon, zgharta accommodations, resort rooms lebanon, family vacation lebanon"
        canonicalUrl="/hotel"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Hotel",
          "name": "Waterland Resort Hotel",
          "description": "Luxury accommodations with waterpark access in Zgharta, Lebanon",
          "image": "https://waterlandresort.com/images/rooms/ambassador-suite.jpg",
          "priceRange": "$$$",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Zgharta",
            "addressRegion": "North Governorate",
            "addressCountry": "Lebanon"
          },
          "amenityFeature": [
            { "@type": "LocationFeatureSpecification", "name": "Waterpark Access", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Free Breakfast", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Free WiFi", "value": true }
          ]
        }}
      />
      
      {/* Hero Section - More Engaging Video + Content Split */}
      <section className="relative">
        <div className="grid grid-cols-1">
          {/* Content */}
          <div className="bg-gradient-to-b from-[#0a4c8b]/10 to-white p-8 lg:p-16 flex items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl mx-auto"
            >
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block bg-[#FFD447] text-[#0a4c8b] text-xs uppercase font-bold tracking-wide px-3 py-1 rounded-full mb-4"
              >
                Premium Experience
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold text-[#0a4c8b] mb-6 font-montserrat leading-tight"
              >
                All 20 Rooms <span className="text-[#00c6ff]">Overlook</span> the Waterpark
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-700 mb-8"
              >
                Wake up to breathtaking views of the waterpark from your private balcony. Every room at Waterland Resort is designed to provide a perfect blend of comfort, style, and convenience for your stay.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-[#4ECDC4]/20 p-2 rounded-full">
                    <Check className="h-5 w-5 text-[#4ECDC4]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">2-Day Waterpark Access</h3>
                    <p className="text-gray-600 text-sm">Enjoy unlimited entry to all attractions</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-[#F86AA0]/20 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-[#F86AA0]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Lebanese Breakfast Included</h3>
                    <p className="text-gray-600 text-sm">Start your day with traditional delights</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-[#FFD447]/20 p-2 rounded-full">
                    <Sparkles className="h-5 w-5 text-[#FFD447]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Modern Amenities</h3>
                    <p className="text-gray-600 text-sm">Air conditioning, Wi-Fi, and premium bedding</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-10"
              >
                <Button 
                  className="bg-[#0a4c8b] hover:bg-[#0a4c8b]/90 text-white px-8 py-3 rounded-lg text-base"
                  onClick={() => {
                    const roomsSection = document.getElementById('rooms-section');
                    if (roomsSection) {
                      roomsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Explore Room Options
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Room Overview Section */}
      <section id="rooms-overview" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16">
            <div className="w-full md:w-1/2 mb-10 md:mb-0">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold text-[#0a4c8b] mb-6 font-montserrat"
              >
                The Perfect Room <br className="hidden md:block" />
                <span className="text-[#00c6ff]">For Every Family</span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-gray-600 mb-8 max-w-lg"
              >
                From cozy Junior Rooms to spacious Ambassador Suites, our accommodations are designed with families in mind. With room options to suit groups of 2-7 people, we ensure everyone has a comfortable space to unwind after a day of adventure.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-2 gap-5"
              >
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-[#0a4c8b]">Junior Room</h3>
                  <p className="text-sm text-gray-500">Ideal for: 2 adults + 1-2 kids</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-[#0a4c8b]">Twin Room</h3>
                  <p className="text-sm text-gray-500">Ideal for: 2 adults + 2-3 kids</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-[#0a4c8b]">Ambassador</h3>
                  <p className="text-sm text-gray-500">Ideal for: 2 adults + 3-4 kids</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-[#0a4c8b]">Helper Options</h3>
                  <p className="text-sm text-gray-500">Available in all room types</p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-5/12 relative"
            >
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={hotelImg} 
                  alt="Waterland Hotel Rooms" 
                  className="w-full h-auto object-cover rounded-lg" 
                />
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="bg-[#00c6ff]/20 p-2 rounded-full">
                    <AlertCircle className="h-4 w-4 text-[#00c6ff]" />
                  </div>
                  <p className="text-sm font-medium text-gray-800">Limited rooms available in peak season!</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Room Categories Section - Tabbed Interface */}
      <section id="rooms-section" className="py-20 bg-[#f8f9fa]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4c8b] mb-4 font-montserrat">Select Your Room</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              All rooms include waterpark access, breakfast, and stunning views.
            </p>
          </motion.div>
          
          {/* Room Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center mb-12 gap-2"
          >
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === "all" 
                  ? "bg-[#0a4c8b] text-white shadow-md" 
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              All Rooms
            </button>
            
            <button
              onClick={() => setActiveTab("junior")}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === "junior" 
                  ? "bg-[#0a4c8b] text-white shadow-md" 
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Junior Room
            </button>
            
            <button
              onClick={() => setActiveTab("twin")}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === "twin" 
                  ? "bg-[#0a4c8b] text-white shadow-md" 
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Twin Room
            </button>
            
            <button
              onClick={() => setActiveTab("ambassador")}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === "ambassador" 
                  ? "bg-[#0a4c8b] text-white shadow-md" 
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Ambassador Suite
            </button>
          </motion.div>
          
          {/* Room Description Cards - for specific selected room type */}
          {activeTab !== "all" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-[#0a4c8b] mb-2 font-montserrat">
                    {roomFeatures[activeTab as keyof typeof roomFeatures].title}
                  </h3>
                  <p className="text-2xl font-bold text-[#00c6ff] mb-6">
                    {roomFeatures[activeTab as keyof typeof roomFeatures].price}
                    <span className="text-sm text-gray-500 font-normal">/night</span>
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    <p className="text-gray-600 font-medium">
                      <span className="font-semibold text-[#0a4c8b]">Ideal for:</span> {roomFeatures[activeTab as keyof typeof roomFeatures].idealFor}
                    </p>
                    
                    <ul className="space-y-2">
                      {roomFeatures[activeTab as keyof typeof roomFeatures].highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-[#0a4c8b] to-[#00c6ff] p-10 flex flex-col justify-center">
                  <h4 className="text-xl font-semibold text-white mb-4">What's Included:</h4>
                  <ul className="space-y-3 text-white mb-8">
                    <li className="flex items-center">
                      <div className="bg-white/20 p-1.5 rounded-full mr-3">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      2-Day Waterpark Access for all guests
                    </li>
                    <li className="flex items-center">
                      <div className="bg-white/20 p-1.5 rounded-full mr-3">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      Complimentary Lebanese Breakfast
                    </li>
                    <li className="flex items-center">
                      <div className="bg-white/20 p-1.5 rounded-full mr-3">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      Air Conditioning & Free Wi-Fi
                    </li>
                    <li className="flex items-center">
                      <div className="bg-white/20 p-1.5 rounded-full mr-3">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      Private Balcony with Waterpark View
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Room Cards */}
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <WaterlandLoader message="Finding your perfect room..." size="large" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">Failed to load room information. Please try again later.</div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredRooms?.map((room) => (
                <motion.div key={room.id} variants={item}>
                  <RoomCard room={room} />
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* Room Recommendation Note - styled as a card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-r from-[#FFD447]/20 to-[#FFD447]/5 rounded-xl shadow-sm p-8 flex flex-col md:flex-row items-center justify-between"
          >
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-xl font-semibold text-[#0a4c8b] mb-2">Not sure which room is right for you?</h3>
              <p className="text-gray-600">
                Let us recommend the ideal room based on your group size and preferences.
              </p>
            </div>
            
            {rooms && rooms.length > 0 && (
              <Button 
                onClick={() => {
                  if (document.getElementById('book-now-trigger')) {
                    document.getElementById('book-now-trigger')?.click();
                  }
                }}
                className="bg-[#0a4c8b] hover:bg-[#0a4c8b]/90 text-white px-6 py-2 rounded-lg text-base whitespace-nowrap"
              >
                Let Us Recommend One
              </Button>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Guest Policy Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
            <div className="bg-[#0a4c8b] p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Resort Policies</h2>
              <p>Important information for a pleasant stay</p>
            </div>
            
            <div className="p-6 md:p-8 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-[#0a4c8b] mb-4 flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="text-green-500 mr-2 mt-1">•</div>
                      <span className="text-gray-700">2-day waterpark access for all registered guests</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-green-500 mr-2 mt-1">•</div>
                      <span className="text-gray-700">Complimentary Lebanese breakfast</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-green-500 mr-2 mt-1">•</div>
                      <span className="text-gray-700">Free Wi-Fi throughout the resort</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-green-500 mr-2 mt-1">•</div>
                      <span className="text-gray-700">Air conditioning and heating</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-green-500 mr-2 mt-1">•</div>
                      <span className="text-gray-700">Daily housekeeping service</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-green-500 mr-2 mt-1">•</div>
                      <span className="text-gray-700">24/7 electricity with backup generators</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-[#d32f2f] mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 text-[#d32f2f] mr-2" />
                    Resort Restrictions
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="text-[#d32f2f] mr-2 mt-1">•</div>
                      <span className="text-gray-700">No pets allowed on the property</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#d32f2f] mr-2 mt-1">•</div>
                      <span className="text-gray-700">Outside food and beverages are not permitted</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#d32f2f] mr-2 mt-1">•</div>
                      <span className="text-gray-700">Check-in: 3:00 PM, Check-out: 12:00 PM</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#d32f2f] mr-2 mt-1">•</div>
                      <span className="text-gray-700">Quiet hours from 11:00 PM to 7:00 AM</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#d32f2f] mr-2 mt-1">•</div>
                      <span className="text-gray-700">Smoking only permitted in designated areas</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hotel;