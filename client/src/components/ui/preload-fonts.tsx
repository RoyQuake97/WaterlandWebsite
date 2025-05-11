import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

/**
 * PreloadFonts component
 * 
 * This component optimizes font loading by:
 * 1. Preconnecting to Google Fonts
 * 2. Preloading critical fonts with higher priority
 * 3. Loading non-critical fonts with lower priority
 * 
 * This helps reduce render-blocking resources and improves LCP.
 */
const PreloadFonts = () => {
  // Generate browser cache keys for fonts to improve cache hit rate across page loads
  const cacheKey = new Date().getMonth(); // Monthly cache key

  // Optimizes font loading by dynamically adding font display swap
  useEffect(() => {
    // Skip in SSR context
    if (typeof window === 'undefined') return;

    // Check if fonts are already loaded from cache
    const fontStatus = sessionStorage.getItem('fontsLoaded');
    
    // If fonts are loaded from cache, no need to flash fallback fonts
    if (fontStatus === 'loaded') {
      document.documentElement.classList.add('fonts-loaded');
    } else {
      // Track when fonts load to avoid flashing fallback fonts on future navigations
      if ('fonts' in document) {
        Promise.all([
          document.fonts.load('1em Montserrat'),
          document.fonts.load('1em Roboto')
        ]).then(() => {
          document.documentElement.classList.add('fonts-loaded');
          sessionStorage.setItem('fontsLoaded', 'loaded');
        });
      }
    }
  }, []);

  return (
    <Helmet>
      {/* Preconnect to Google Fonts */}
      <link 
        rel="preconnect" 
        href="https://fonts.googleapis.com" 
        crossOrigin="" 
      />
      <link 
        rel="preconnect" 
        href="https://fonts.gstatic.com" 
        crossOrigin="" 
      />
      
      {/* Preload critical fonts */}
      <link
        rel="preload"
        as="style"
        href={`https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Roboto:wght@400;500&display=swap&_v=${cacheKey}`}
      />
      
      {/* Load critical fonts with display=swap */}
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Roboto:wght@400;500&display=swap&_v=${cacheKey}`}
        media="print"
        onLoad="this.media='all'"
      />
      
      {/* Load non-critical font weights using lower priority */}
      <link 
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Roboto:wght@300;700&display=swap&_v=${cacheKey}`}
        media="print"
        onLoad="this.media='all'"
      />
      
      {/* No-JS fallback */}
      <noscript>{`
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Roboto:wght@300;400;500;700&display=swap"
        />
      `}</noscript>
      
      {/* Add font-display CSS */}
      <style type="text/css">{`
        /* Apply font-display: swap for all loaded fonts */
        @font-face {
          font-family: 'Montserrat';
          font-style: normal;
          font-weight: 400 800;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 300 700;
          font-display: swap;
        }
        
        /* Prevent content jump when fonts load */
        .fonts-loaded body {
          visibility: visible;
        }
      `}</style>
    </Helmet>
  );
};

export default PreloadFonts;