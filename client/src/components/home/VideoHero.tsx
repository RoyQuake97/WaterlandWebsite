import { useEffect, useRef, useState, memo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { preloadVideo } from "@/lib/resourceLoader";

const VideoHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Parallax effects
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);

  // Text reveal animations
  const titleVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }
    }
  };

  const textVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const video = containerRef.current.querySelector('video');
      if (video) {
        video.playbackRate = 0.8; // Slower, more luxurious feel
      }
    }
  }, []);

  return (
    <motion.section 
      ref={containerRef}
      className="relative h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ y, scale }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: isVideoLoaded ? 1 : 0, transition: 'opacity 1.5s ease' }}
          onLoadedData={() => setIsVideoLoaded(true)}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </motion.div>

      <motion.div 
        className="relative h-full flex items-center justify-center"
        style={{ opacity }}
      >
        <div className="text-center space-y-8 p-8 backdrop-blur-sm bg-black/20 rounded-2xl border border-white/10">
          <motion.h1 
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="text-6xl md:text-8xl font-bold text-white space-y-2"
          >
            <span className="block text-waterland-yellow transform hover:scale-105 transition-transform duration-300">
              Experience
            </span>
            <span className="block text-waterland-lightblue transform hover:scale-105 transition-transform duration-300">
              Paradise
            </span>
          </motion.h1>

          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible" 
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
          >
            <Link href="/waterpark">
              <Button className="bg-waterland-lightblue/80 hover:bg-waterland-lightblue text-white text-xl px-8 py-6 rounded-full transform hover:scale-105 transition-all duration-300">
                Explore Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to top, white, transparent)"
        }}
      />
    </motion.section>
  );
};

export default memo(VideoHero);