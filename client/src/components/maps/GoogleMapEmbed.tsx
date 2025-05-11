import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

type GoogleMapEmbedProps = {
  title?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  height?: string;
  width?: string;
  showDirectionsButton?: boolean;
};

const GoogleMapEmbed = ({
  title = "Visit Waterland Resort & Waterpark",
  description = "Located in Zghartā, North Lebanon. Come visit us for a day of fun and relaxation!",
  latitude = 34.3972,  // Coordinates for Zghartā, Lebanon
  longitude = 35.8947,
  zoom = 15,
  height = "500px",
  width = "100%",
  showDirectionsButton = true
}: GoogleMapEmbedProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Replace spaces with plus signs for the query parameter
  const location = `${latitude},${longitude}`;
  const address = "Waterland Resort & Waterpark, Zghartā, North Lebanon";
  const encodedAddress = encodeURIComponent(address);
  
  // URL for directions
  const directionsUrl = "https://maps.app.goo.gl/SJjCgzuxUXkuaTwx8";
  
  // Actual Google Maps embed URL
  const actualMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.5475054914154!2d35.914885999999996!3d34.406881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1521f6027c540115%3A0xc616465471c1d075!2sWaterland%20Resort%20%26%20Waterpark!5e1!3m2!1sen!2slb!4v1746522112499!5m2!1sen!2slb";
  
  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-xl shadow-lg">
        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin h-12 w-12 rounded-full border-4 border-waterland-blue border-t-transparent"></div>
          </div>
        )}
        
        {/* Map iframe */}
        <motion.iframe
          src={actualMapUrl}
          width={width}
          height={height}
          style={{ border: 0, width: '100%', minHeight: height }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps"
          className="rounded-xl"
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        ></motion.iframe>
        
        {/* Overlay with info */}
        <motion.div 
          className="absolute top-4 left-4 md:top-6 md:left-6 max-w-xs bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-start space-x-2">
            <MapPin className="h-5 w-5 text-waterland-blue mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-waterland-blue">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Directions button */}
      {showDirectionsButton && (
        <motion.div 
          className="mt-4 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
            <Button 
              className="bg-waterland-blue hover:bg-waterland-blue/90 text-white font-medium py-2 px-6"
              size="lg"
            >
              <Navigation className="h-5 w-5 mr-2" />
              Get Directions
            </Button>
          </a>
        </motion.div>
      )}
    </div>
  );
};

export default GoogleMapEmbed;