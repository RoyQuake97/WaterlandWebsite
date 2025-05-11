import React from 'react';

/**
 * Generates JSON-LD structured data for a local business
 * This improves local SEO and provides search engines with rich, structured information
 */
export const getLocationSchemaData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Resort',
    name: 'Waterland Resort & Waterpark',
    description: 'A premier resort and waterpark in Zgharta, Lebanon, offering luxury accommodations, exciting water attractions, dining options, and event facilities.',
    url: 'https://waterlandresort.com',
    telephone: '+961 70 510 510',
    email: 'info@waterlandresort.com',
    sameAs: [
      'https://www.facebook.com/WATERLANDLEBANON/',
      'https://www.instagram.com/waterland.lb/'
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Zgharta Road',
      addressLocality: 'Zgharta',
      addressRegion: 'North Governorate',
      addressCountry: 'Lebanon'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '34.3979',  // Replace with actual coordinates
      longitude: '35.8869'  // Replace with actual coordinates
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        ],
        opens: '10:00',
        closes: '19:00'
      }
    ],
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Waterpark',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Swimming Pools',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Hotel Accommodations',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Restaurant',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Event Venues',
        value: true
      }
    ],
    image: [
      'https://waterlandresort.com/images/resort-exterior.jpg',
      'https://waterlandresort.com/images/waterpark-overview.jpg'
    ],
    priceRange: '$$$'
  };
};

/**
 * Component for including location-specific structured data
 */
const LocationSchema: React.FC = () => {
  const locationData = getLocationSchemaData();
  
  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(locationData) }}
    />
  );
};

export default LocationSchema;