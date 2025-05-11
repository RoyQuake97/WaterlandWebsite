import React from 'react';
import { commonSchemaData } from '@/lib/seo/keywords';

/**
 * Schema markup for the events venue page
 * This helps search engines understand the event venue facilities and offerings
 */
const EventVenueSchema: React.FC = () => {
  const eventVenueData = {
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    ...commonSchemaData,
    description: 'Host your special events at Waterland Resort in Zgharta, Lebanon. Our versatile venues are perfect for weddings, birthdays, corporate events, and celebrations of all kinds.',
    publicAccess: true,
    maximumAttendeeCapacity: 250,
    availableLanguage: ['English', 'Arabic', 'French'],
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Indoor Venue',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Outdoor Venue',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Catering',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Audio/Visual Equipment',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Parking',
        value: true
      }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Event Packages',
      itemListElement: [
        {
          '@type': 'Offer',
          name: 'Birthday Party Package',
          description: 'Complete birthday party package including waterpark access, food, and activities',
          price: '25',
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '25',
            priceCurrency: 'USD',
            unitText: 'per person (minimum 10 guests)'
          }
        },
        {
          '@type': 'Offer',
          name: 'Wedding Reception Package',
          description: 'Elegant wedding reception with catering, decor, and waterpark views',
          price: '5000',
          priceCurrency: 'USD'
        },
        {
          '@type': 'Offer',
          name: 'Corporate Event Package',
          description: 'Meeting spaces with audiovisual equipment, catering options, and team-building activities',
          price: '2000',
          priceCurrency: 'USD'
        }
      ]
    },
    photo: [
      {
        '@type': 'ImageObject',
        contentUrl: 'https://waterland.com/images/events/wedding.jpg',
        name: 'Waterland Wedding Venue'
      },
      {
        '@type': 'ImageObject',
        contentUrl: 'https://waterland.com/images/events/corporate.jpg', 
        name: 'Waterland Corporate Event Space'
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(eventVenueData) }}
    />
  );
};

export default EventVenueSchema;