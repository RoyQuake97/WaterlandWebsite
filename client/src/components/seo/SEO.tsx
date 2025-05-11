import { Helmet } from 'react-helmet';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  keywords?: string;
  structuredData?: Record<string, any>;
}

/**
 * SEO component for managing metadata and search engine optimization
 */
const SEO = ({
  title,
  description,
  canonicalUrl,
  ogImage = '/images/waterland-resort-og.jpg',
  ogType = 'website',
  keywords,
  structuredData,
}: SEOProps) => {
  // Construct the full title with branding
  const fullTitle = `${title} | Waterland Resort & Waterpark Lebanon`;
  
  // Default URL if none provided
  const siteUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://waterlandresort.com';
  
  const canonical = canonicalUrl ? `${siteUrl}${canonicalUrl}` : undefined;
  
  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content="Waterland Resort & Waterpark" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Structured Data / JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;