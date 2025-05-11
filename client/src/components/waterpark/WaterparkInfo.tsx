import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

const waterparkImages = [
  {
    image: "https://images.unsplash.com/photo-1550226891-ef816aed4a98?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    alt: "Waterslide fun"
  },
  {
    image: "https://images.unsplash.com/photo-1568385247005-0d371d214a2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    alt: "Resort pool"
  },
  {
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
    alt: "Water attraction"
  },
  {
    image: "https://images.unsplash.com/photo-1581419627497-7a9c4b9b9c9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    alt: "Fun water slides"
  }
];

const WaterparkInfo = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const { data: siteSettings } = useQuery({
    queryKey: ['/api/site-settings'],
  });

  const scrollToSlide = (index: number) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.scrollWidth / waterparkImages.length;
      carouselRef.current.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
      });
      setActiveSlide(index);
    }
  };

  // Handle manual scroll detection
  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const slideWidth = carouselRef.current.scrollWidth / waterparkImages.length;
      const currentSlide = Math.round(scrollPosition / slideWidth);
      setActiveSlide(currentSlide);
    }
  };

  return (
    <div className="mb-12">
      {/* Waterpark Gallery */}
      <div className="mb-8 relative">
        <div 
          className="carousel flex overflow-x-auto gap-4 pb-4 hide-scrollbar"
          ref={carouselRef}
          onScroll={handleScroll}
        >
          {waterparkImages.map((image, index) => (
            <div 
              key={index}
              className="carousel-item flex-shrink-0 w-full md:w-1/3 rounded-lg overflow-hidden shadow-lg"
            >
              <img 
                src={image.image} 
                alt={image.alt} 
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Gallery Controls */}
        <div className="flex justify-center gap-2 mt-4">
          {waterparkImages.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === activeSlide 
                  ? "bg-[#00c6ff]" 
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Waterpark Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h3 className="text-2xl font-bold text-[#0a4b78] mb-4 font-montserrat">The Ultimate Water Adventure</h3>
          <p className="text-gray-600 mb-4">
            Welcome to Waterland, Lebanon's premier waterpark destination where adventure meets relaxation. Our park 
            features thrilling water slides, a lazy river, wave pools, and dedicated children's play areas.
          </p>
          <p className="text-gray-600 mb-4">
            Whether you're seeking an adrenaline rush or a peaceful day by the pool, Waterland offers the perfect 
            escape for visitors of all ages.
          </p>
          <div className="bg-[#00c6ff] bg-opacity-10 p-4 rounded-lg border-l-4 border-[#00c6ff]">
            <h4 className="font-bold text-[#0a4b78] mb-2">Opening Hours</h4>
            <p className="text-gray-600">Open daily from {siteSettings?.openingHours || "10:00 AM to 7:00 PM"}</p>
          </div>
        </div>
        
        <div>
          {/* PricingCards component will be placed here */}
        </div>
      </div>
    </div>
  );
};

export default WaterparkInfo;
