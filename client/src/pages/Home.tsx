import VideoHero from "@/components/home/VideoHero";
import OpeningHours from "@/components/home/OpeningHours";
import { Thermometer, CalendarDays, ChevronRight, Instagram } from 'lucide-react';
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { SiteSettings } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PageLoadingSkeleton } from "@/components/ui/page-loading-skeleton";
import AttractionsGrid from "../components/attractions/AttractionsGrid";
import GoogleReviewsWidget from "../components/reviews/GoogleReviewsWidget";
import GoogleReviewsFetcher from "../components/reviews/GoogleReviewsFetcher";
import EnhancedGoogleReviews from "../components/reviews/EnhancedGoogleReviews";
import VirtualTourButton from "../components/tours/VirtualTourButton";
import SEO from "@/components/seo/SEO";
import LocationSchema from "@/components/seo/LocationSchema";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [daysUntilOpening, setDaysUntilOpening] = useState(20);

  const { data: siteSettings, isLoading: isDataLoading } = useQuery<SiteSettings>({
    queryKey: ['/api/site-settings'],
  });

  type TempData = {
    c: number;
  };

  const { data: tempData } = useQuery<TempData>({
    queryKey: ['/api/wtemp'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    const calculateDaysUntilOpening = () => {
      const today = new Date();
      const openingDate = new Date('May 23, 2025');
      const timeDiff = openingDate.getTime() - today.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysUntilOpening(dayDiff > 0 ? dayDiff : 0);
    };

    calculateDaysUntilOpening();
  }, []);

  // Simulate a minimum loading time for better UX
  useEffect(() => {
    if (!isDataLoading) {
      // Add a slight delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isDataLoading]);

  // Set up refs for scroll animations
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "-50px 0px"
  });

  const featureSectionRef = useRef<HTMLDivElement>(null);

  // GSAP animation for scrolling parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (featureSectionRef.current) {
        const section = featureSectionRef.current;
        const scrollPosition = window.scrollY;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition > sectionTop - window.innerHeight && 
            scrollPosition < sectionTop + sectionHeight) {
          const parallaxCards = section.querySelectorAll('.feature-card');
          parallaxCards.forEach((card: Element, i: number) => {
            // Create a subtle floating effect based on scroll position
            gsap.to(card, {
              y: Math.sin((scrollPosition - sectionTop + i * 100) / 500) * 10,
              duration: 0.5,
              ease: "power1.out"
            });
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const sectionTitleVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.2 + (i * 0.2),
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    })
  };

  const iconContainerVariants = {
    hidden: { scale: 0, rotate: -20 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.3
      }
    }
  };

  return (
    <div>
      <SEO 
        title="Splash into Fun at Lebanon's Premier Water Resort"
        description="Experience the perfect getaway at Waterland Resort & Waterpark in Zgharta, Lebanon. Enjoy thrilling water attractions, luxury accommodations, and amazing dining options for the whole family."
        keywords="waterpark lebanon, water resort lebanon, family resort zgharta, swimming pools lebanon, vacation resort lebanon, water slides lebanon"
        canonicalUrl="/"
      />
      <LocationSchema />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PageLoadingSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <VideoHero />
            </div>
            <OpeningHours />
            
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attractions Grid Section */}
      <div ref={featureSectionRef} id="explore-attractions">
        <AttractionsGrid onSelect={(key) => console.log(`Selected attraction: ${key}`)} />
      </div>



      {/* Enhanced Google Reviews Section */}
      <section id="google-reviews">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <EnhancedGoogleReviews />
        </motion.div>
      </section>

      {/* Social Media Links Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-4xl font-extrabold text-waterland-blue mb-3 font-montserrat">Stay Connected!</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto mb-8">
              Follow us for exclusive deals, updates, and a peek behind the scenes
            </p>

            {/* Horizontal layout on desktop, vertical on mobile */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
              {/* Instagram Card */}
              <motion.a
                href="https://www.instagram.com/waterland.lb/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto max-w-xs bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 rounded-full px-4 py-3 shadow-md hover:shadow-lg transition-all duration-300 group"
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 0 15px rgba(236, 72, 153, 0.4)" 
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mr-3">
                    <Instagram size={20} className="text-white" />
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-white text-base">Follow on Instagram</span>
                    <span className="ml-1 bg-white/30 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">✓</span>
                  </div>
                </div>
              </motion.a>

              {/* Facebook Card */}
              <motion.a
                href="https://www.facebook.com/WATERLANDLEBANON/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto max-w-xs bg-gradient-to-r from-blue-600 to-blue-500 rounded-full px-4 py-3 shadow-md hover:shadow-lg transition-all duration-300 group"
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)" 
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-white text-lg">Like us on Facebook</span>
                    <span className="ml-1 bg-white/30 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">✓</span>
                  </div>
                </div>
              </motion.a>

              {/* WhatsApp Card */}
              <motion.a
                href="https://wa.me/96170510510" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto max-w-xs bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-4 py-3 shadow-md hover:shadow-lg transition-all duration-300 group"
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 0 15px rgba(34, 197, 94, 0.4)" 
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                    </svg>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-white text-lg">Message on WhatsApp</span>
                  </div>
                </div>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;