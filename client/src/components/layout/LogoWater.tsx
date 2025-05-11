import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import waterlandLogo from "../../assets/waterland-logo.jpg";
import gsap from "gsap";

const LogoWater = () => {
  const logoRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Setup interactive hover effect on logo
  useEffect(() => {
    if (logoRef.current) {
      const logoElement = logoRef.current;
      
      const handleMouseMove = (e: MouseEvent) => {
        const rect = logoElement.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calculate distance from center
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Create subtle tilt effect with GSAP
        gsap.to(imageRef.current, {
          duration: 0.5,
          scale: 1.05,
          x: (mouseX - centerX) * 0.02,
          y: (mouseY - centerY) * 0.02,
          rotation: ((mouseX - centerX) * 0.005),
          ease: "power2.out"
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(imageRef.current, {
          duration: 0.5,
          scale: 1,
          x: 0,
          y: 0,
          rotation: 0,
          ease: "elastic.out(1, 0.5)"
        });
      };
      
      logoElement.addEventListener('mousemove', handleMouseMove);
      logoElement.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        logoElement.removeEventListener('mousemove', handleMouseMove);
        logoElement.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <Link href="/">
      <div 
        ref={logoRef}
        className="relative flex items-center cursor-pointer overflow-hidden group h-16 w-auto"
      >
        {/* Logo image with simple hover effect */}
        <motion.div 
          className="relative z-10 px-1 py-1"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <img 
            ref={imageRef}
            src={waterlandLogo} 
            alt="Waterland Resort & Waterpark" 
            className="h-14 w-auto object-contain filter drop-shadow-sm"
          />
        </motion.div>
        
        {/* Subtle shine effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
          initial={{ x: '-100%' }}
          whileHover={{
            x: '100%',
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
        />
      </div>
    </Link>
  );
};

export default LogoWater;