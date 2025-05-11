import { ArrowRight } from "lucide-react";
import { PLACEHOLDER_IMAGE } from './AttractionImages';
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { attractionsArray } from "./AttractionsData";

interface AttractionsGridProps {
  onSelect?: (key: string) => void;
}

const AttractionsGrid = ({ onSelect = () => {} }: AttractionsGridProps) => {
  const [, setLocation] = useLocation();
  
  const handleAttractionClick = (key: string) => {
    onSelect(key);
    setLocation(`/attraction/${key}`);
  };
  
  return (
    <section className="py-20 bg-white" id="attractions">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-waterland-blue text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Explore Our Attractions
        </motion.h2>
        
        <motion.p
          className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Slides, kids zones, VIP pool, snacks, hotel stays — everything you need for the perfect summer day, all in one place.
        </motion.p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {attractionsArray.map((attraction, index) => (
            <motion.div
              key={attraction.key}
              className="w-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <div className="block w-full h-full rounded-3xl">
                <motion.div 
                  className="relative aspect-square rounded-3xl shadow-md overflow-hidden cursor-pointer"
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAttractionClick(attraction.key)}
                >
                  {/* Image */}
                  <img 
                    src={attraction.thumbnailImage} 
                    alt={attraction.title} 
                    className="w-full h-full object-cover rounded-3xl"
                    onError={(e) => {
                      console.error(`Error loading image for ${attraction.title}`);
                      e.currentTarget.onerror = null;
                      // Try loading from PLACEHOLDER_IMAGE
                      e.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                  
                  {/* Overlay */}
                  <motion.div 
                    className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 rounded-3xl ${attraction.comingSoon ? 'backdrop-blur-sm' : ''}`}
                    whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                  >
                    {attraction.comingSoon && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-white/90 backdrop-blur-sm py-1 px-3 rounded-md shadow-md border border-[#F86AA0]">
                          <span className="text-[#F86AA0] font-semibold text-xs">COMING SOON</span>
                        </div>
                      </div>
                    )}
                    <h3 
                      className="text-lg md:text-xl font-semibold text-white text-center mb-2"
                      style={{ textShadow: `0 2px 4px rgba(0,0,0,0.5), 0 0 20px ${attraction.color}` }}
                    >
                      {attraction.title}
                    </h3>
                    
                    {attraction.shortDescription && (
                      <p className="text-white/80 text-sm text-center mb-4 max-w-[200px]">
                        {attraction.shortDescription}
                      </p>
                    )}
                    
                    <motion.div
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm"
                      whileHover={{ 
                        scale: 1.2,
                        backgroundColor: "rgba(255, 255, 255, 0.3)" 
                      }}
                      style={{ boxShadow: `0 0 12px ${attraction.color}` }}
                    >
                      <ArrowRight className="h-5 w-5 text-white" />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AttractionsGrid;