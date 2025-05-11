import React from 'react';
import { commonSchemaData } from '@/lib/seo/keywords';

/**
 * Structured data component for the waterpark attractions
 * This helps search engines understand waterpark details, offerings, and hours
 */
const WaterparkSchema: React.FC = () => {
  const waterparkData = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    ...commonSchemaData,
    description: 'Waterland Waterpark in Zgharta, Lebanon features thrilling water slides, wave pools, lazy river, kids play areas, and more for a perfect family day out.',
    openingHours: 'Mo-Su 10:00-19:00',
    touristType: ['Family', 'Travellers', 'Adventure Seekers'],
    availableLanguage: ['English', 'Arabic', 'French'],
    priceRange: '$$ - $$$',
    publicAccess: true,
    smokingAllowed: false,
    subjectOf: {
      '@type': 'CreativeWork',
      name: 'Waterland Waterpark Guide',
      description: 'A complete guide to attractions, amenities, and experiences at Waterland Waterpark'
    },
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Water Slides',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Wave Pool',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Lazy River',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Kids Play Area',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Food & Beverage',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Loungers & Umbrellas',
        value: true
      }
    ],
    photo: [
      {
        '@type': 'ImageObject',
        contentUrl: 'https://waterland.com/images/waterpark1.jpg',
        name: 'Waterland Waterpark Slides'
      },
      {
        '@type': 'ImageObject',
        contentUrl: 'https://waterland.com/images/waterpark2.jpg',
        name: 'Waterland Wave Pool'
      }
    ],
    isAccessibleForFree: false,
    maximumAttendeeCapacity: 1500
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(waterparkData) }}
    />
  );
};

export default WaterparkSchema;