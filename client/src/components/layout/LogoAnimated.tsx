import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import waterlandLogo from "../../assets/waterland-logo.jpg";

const LogoAnimated = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation variants for the logo
  const logoVariants = {
    normal: { 
      scale: 1,
      rotate: 0,
      transition: { duration: 0.3 }
    },
    hovered: { 
      scale: 1.05,
      rotate: 2,
      transition: { duration: 0.3 }
    }
  };

  // Wave animation for the water effect
  const waveVariants = {
    animate: {
      x: [0, -20, 0],
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Link href="/">
      <div 
        className="relative flex items-center cursor-pointer group" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="relative"
          variants={logoVariants}
          animate={isHovered ? "hovered" : "normal"}
        >
          {/* Logo image */}
          <img 
            src={waterlandLogo} 
            alt="Waterland Resort & Waterpark" 
            className="h-12 w-auto object-contain z-10 relative"
          />
          
          {/* Decorative elements */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-waterland-lightblue via-waterland-blue to-waterland-lightblue rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-300"
            variants={waveVariants}
            animate="animate"
          />
        </motion.div>
        
        {/* Shine effect on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-white opacity-0"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0, 0.25, 0],
              scale: 1.5,
              x: ["-100%", "100%"]
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        )}
      </div>
    </Link>
  );
};

export default LogoAnimated;