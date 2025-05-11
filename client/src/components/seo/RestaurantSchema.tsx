import React from 'react';
import { commonSchemaData } from '@/lib/seo/keywords';

/**
 * Schema markup for the restaurant page
 * This helps search engines understand the restaurant details
 */
const RestaurantSchema: React.FC = () => {
  const restaurantData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    ...commonSchemaData,
    description: 'Experience fine dining with a view at Waterland Resort Restaurant, featuring Lebanese and international cuisine in Zgharta, North Lebanon.',
    priceRange: '$$',
    servesCuisine: ['Lebanese', 'Mediterranean', 'International'],
    menu: 'https://waterland.com/menu',
    acceptsReservations: 'Yes',
    openingHours: [
      'Mo-Th 11:00-22:00',
      'Fr-Su 10:00-23:00'
    ],
    image: [
      'https://waterland.com/images/restaurant1.jpg',
      'https://waterland.com/images/restaurant2.jpg'
    ],
    telephone: '+961 70 510 510',
    paymentAccepted: 'Cash, Credit Card',
    hasMenu: {
      '@type': 'Menu',
      hasMenuSection: [
        {
          '@type': 'MenuSection',
          name: 'Main Dishes',
          hasMenuItem: [
            {
              '@type': 'MenuItem',
              name: 'Lebanese Mixed Grill',
              description: 'Selection of grilled meats with rice and vegetables',
              price: '$25.00'
            },
            {
              '@type': 'MenuItem',
              name: 'Grilled Sea Bass',
              description: 'Fresh sea bass with lemon sauce and seasonal vegetables',
              price: '$28.00'
            }
          ]
        },
        {
          '@type': 'MenuSection',
          name: 'Beverages',
          hasMenuItem: [
            {
              '@type': 'MenuItem',
              name: 'Fresh Fruit Cocktail',
              description: 'Seasonal fruits blended with ice',
              price: '$8.00'
            },
            {
              '@type': 'MenuItem',
              name: 'Lebanese Arak',
              description: 'Traditional anise-flavored spirit',
              price: '$10.00'
            }
          ]
        }
      ]
    },
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Air Conditioning',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Outdoor Seating',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Waterpark View',
        value: true
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantData) }}
    />
  );
};

export default RestaurantSchema;