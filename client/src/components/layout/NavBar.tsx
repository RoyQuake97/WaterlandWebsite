import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { SiteSettings } from "@shared/schema";
import { MessageSquare } from "lucide-react";
import waterlandLogo from "../../assets/optimized/waterland-logo-small.png";
import ForecastWidget from "../weather/ForecastWidget";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Get site settings to check if hiring is active
  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ['/api/site-settings'],
  });

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Handle ESC key to close menu
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isMenuOpen]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target as Node) && 
          navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav 
      ref={navRef}
      className={`sticky top-0 z-50 bg-white ${isScrolled ? 'shadow-md' : ''} transition-shadow duration-300`}
    >
      {/* Weather Forecast Widget - Top Bar */}
      <div className="flex justify-end items-center bg-gradient-to-r from-[#35b9e6]/10 to-[#4db848]/10 px-4 py-1 overflow-x-auto">
        <ForecastWidget />
      </div>

      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md" aria-label="Home page">
                <img 
                  src={waterlandLogo} 
                  alt="Waterland Lebanon logo" 
                  className="w-[120px] lg:w-[180px] h-auto transition-all duration-300"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            <Link href="/attraction/waterpark-slides">
              <div className={`px-3 py-2 font-medium rounded-md ${isActive('/attraction/waterpark-slides') ? 'text-[#0A4C8B]' : 'text-[#0A4C8B] hover:text-[#F86AA0]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer`}>
                Resort
              </div>
            </Link>
            <Link href="/attraction/waterpark-slides">
              <div className={`px-3 py-2 font-medium rounded-md ${isActive('/attraction/waterpark-slides') ? 'text-[#0A4C8B]' : 'text-[#0A4C8B] hover:text-[#F86AA0]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer`}>
                Slides
              </div>
            </Link>
            <Link href="/hotel">
              <div className={`px-3 py-2 font-medium rounded-md ${isActive('/hotel') ? 'text-[#0A4C8B]' : 'text-[#0A4C8B] hover:text-[#F86AA0]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer`}>
                Rooms
              </div>
            </Link>
            <Link href="/hotel">
              <div className={`px-5 py-2 font-medium bg-[#0A4C8B] text-white rounded-md hover:bg-[#0A4C8B]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}>
                Book Now
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={toggleMenu}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-[#0A4C8B] hover:text-[#F86AA0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
          >
            <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-[height] duration-300 ease-in-out ${isMenuOpen ? 'h-[280px]' : 'h-0'}`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 bg-white shadow-lg">
          <Link href="/attraction/waterpark-slides">
            <div className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/attraction/waterpark-slides') ? 'bg-[#0A4C8B]/10 text-[#0A4C8B]' : 'text-[#0A4C8B] hover:bg-[#0A4C8B]/5'} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200 cursor-pointer`}>
              Resort
            </div>
          </Link>
          <Link href="/attraction/waterpark-slides">
            <div className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/attraction/waterpark-slides') ? 'bg-[#0A4C8B]/10 text-[#0A4C8B]' : 'text-[#0A4C8B] hover:bg-[#0A4C8B]/5'} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200 cursor-pointer`}>
              Slides
            </div>
          </Link>
          <Link href="/hotel">
            <div className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/hotel') ? 'bg-[#0A4C8B]/10 text-[#0A4C8B]' : 'text-[#0A4C8B] hover:bg-[#0A4C8B]/5'} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200 cursor-pointer`}>
              Rooms
            </div>
          </Link>
          <Link href="/hotel">
            <div className="block px-3 py-2 mt-2 text-base font-medium text-white bg-[#0A4C8B] rounded-md hover:bg-[#0A4C8B]/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer">
              Book Now
            </div>
          </Link>
          {siteSettings?.isHiringActive && (
            <Link href="/careers">
              <div className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/careers') ? 'bg-[#FFD447]/10 text-[#0A4C8B]' : 'text-[#0A4C8B] hover:bg-[#FFD447]/5'} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200 cursor-pointer`}>
                Join Our Team
              </div>
            </Link>
          )}
          <a
            href="https://wa.me/96170510510"
            className="flex items-center gap-2 px-3 py-2 mt-3 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            <MessageSquare className="h-4 w-4" />
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;