import React from 'react';
import { Room } from '@shared/schema';

interface RoomSchemaProps {
  room: Room;
}

/**
 * Component to add structured data for hotel room offers
 * This helps search engines understand room pricing and availability
 */
const RoomSchema: React.FC<RoomSchemaProps> = ({ room }) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'HotelRoom',
    'name': room.title,
    'description': room.description,
    'occupancy': {
      '@type': 'QuantitativeValue',
      'maxValue': room.maxAdults + room.maxChildren
    },
    'amenityFeature': [
      {
        '@type': 'LocationFeatureSpecification',
        'name': 'Air conditioning',
        'value': true
      },
      {
        '@type': 'LocationFeatureSpecification',
        'name': 'Free WiFi',
        'value': true
      },
      {
        '@type': 'LocationFeatureSpecification',
        'name': 'Waterpark Access',
        'value': true
      }
    ],
    'offers': {
      '@type': 'Offer',
      'priceSpecification': {
        '@type': 'PriceSpecification',
        'price': room.pricePerNight,
        'priceCurrency': 'USD',
        'validFrom': '2025-05-01',
        'validThrough': '2025-12-31'
      },
      'availability': room.isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    },
    'containedInPlace': {
      '@type': 'Hotel',
      'name': 'Waterland Resort Hotel',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Zgharta',
        'addressRegion': 'North Governorate',
        'addressCountry': 'Lebanon'
      }
    }
  };
  
  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default RoomSchema;