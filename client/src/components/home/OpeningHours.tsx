import { Link } from "wouter";
import { MapPin, Phone, Clock } from "lucide-react";
import type { SiteSettings } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const OpeningHours = () => {
  const { data, isLoading } = useQuery<SiteSettings>({
    queryKey: ['/api/site-settings'],
  });

  return (
    <div className="relative w-full bg-white/30 backdrop-blur-md py-4 shadow-lg z-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {/* Opening Hours */}
          <motion.a 
            className="group flex items-center gap-3"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="bg-waterland-blue/10 group-hover:bg-waterland-blue/20 rounded-full p-2 transition-all">
              <Clock className="h-4 w-4 text-waterland-blue" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-waterland-blue text-sm">Opening Hours</span>
              <span className="text-gray-600 text-center">
                {isLoading ? "Loading..." : data?.openingHours || "10:00 AM – 7:00 PM"}
              </span>
            </div>
          </motion.a>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Location */}
            <motion.a 
              href="https://maps.app.goo.gl/SJjCgzuxUXkuaTwx8"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View location on Google Maps"
              className="group flex items-center gap-3"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-waterland-purple/10 group-hover:bg-waterland-purple/20 rounded-full p-3 transition-all">
                <MapPin className="h-5 w-5 text-waterland-purple" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-waterland-blue">Location</span>
                <span className="text-gray-600">Ardeh, Zgharta</span>
              </div>
            </motion.a>

            {/* Phone */}
            <motion.a 
              href="tel:+96170510510"
              className="group flex items-center gap-3"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-waterland-pink/10 group-hover:bg-waterland-pink/20 rounded-full p-3 transition-all">
                <Phone className="h-5 w-5 text-waterland-pink" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-waterland-blue">Call Us</span>
                <span className="text-gray-600">+961 70 510 510</span>
              </div>
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpeningHours;