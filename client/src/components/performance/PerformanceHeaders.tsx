import { Helmet } from 'react-helmet';

/**
 * PerformanceHeaders - Adds performance-related meta tags and headers
 * This component sets up various browser hints for performance optimization:
 * - DNS prefetching for external domains
 * - Preconnect for critical third-party resources
 * - Resource hints for better browser prioritization
 * - Cache control policies
 */
const PerformanceHeaders = () => {
  return (
    <Helmet>
      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="dns-prefetch" href="https://maps.googleapis.com" />
      
      {/* Preconnect to critical domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* Resource hints for better prioritization */}
      <meta http-equiv="X-DNS-Prefetch-Control" content="on" />
      
      {/* Browser cache control */}
      <meta http-equiv="Cache-Control" content="public, max-age=3600" />
      
      {/* Prevent mobile browsers from scaling the viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5" />
      
      {/* Performance optimizations */}
      <meta name="theme-color" content="#0A4C8B" />
      <meta name="color-scheme" content="light" />
      
      {/* Web App capabilities */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Resource hints - preload critical fonts */}
      <link 
        rel="preload" 
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap" 
        as="style" 
      />
    </Helmet>
  );
};

export default PerformanceHeaders;