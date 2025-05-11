import React from 'react';
import { commonSchemaData } from '@/lib/seo/keywords';

/**
 * Schema markup for the waterpark attractions
 * This helps search engines understand the specific attraction details
 */
const AttractionSchema: React.FC = () => {
  const waterpark = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    ...commonSchemaData,
    'name': 'Waterpark & Slides',
    'description': 'Thrilling slides, splash zones, and colorful attractions for all ages.',
    'openingHours': 'Mo-Su 10:00-19:00',
    'priceRange': '$20 per person',
    'publicAccess': true,
    'tourBookingPage': 'https://waterlandresort.com/waterpark',
    'availableLanguage': ['English', 'Arabic'],
    'additionalProperty': [
      {
        '@type': 'PropertyValue',
        'name': 'Lifeguards',
        'value': 'Present at all pools and slides'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Seating',
        'value': 'Shaded areas and umbrellas available'
      }
    ]
  };

  const kidsSplash = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    ...commonSchemaData,
    'name': 'Kids Splash Zone',
    'description': 'A magical, safe water world designed just for little adventurers.',
    'openingHours': 'Mo-Su 10:00-19:00',
    'priceRange': 'Included in general admission',
    'publicAccess': true,
    'tourBookingPage': 'https://waterlandresort.com/waterpark',
    'availableLanguage': ['English', 'Arabic'],
    'additionalProperty': [
      {
        '@type': 'PropertyValue',
        'name': 'Age Group',
        'value': 'Ideal for toddlers and children under 10'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Safety Features',
        'value': 'Soft flooring, shallow water, lifeguards present'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Features',
        'value': 'Tipping bucket, sprayers, mini slides, animal sculptures'
      }
    ]
  };

  const vipPool = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    ...commonSchemaData,
    'name': 'VIP Pool & Pool Bar',
    'description': 'A serene, adults-preferred zone with towel service and premium comfort.',
    'openingHours': 'Mo-Su 10:00-19:00',
    'priceRange': '$25 per person (includes towel)',
    'publicAccess': true,
    'tourBookingPage': 'https://waterlandresort.com/waterpark/vip',
    'availableLanguage': ['English', 'Arabic'],
    'additionalProperty': [
      {
        '@type': 'PropertyValue',
        'name': 'Services',
        'value': 'Towel service, quick food & drink delivery'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Capacity',
        'value': 'Limited for exclusive experience'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Features',
        'value': 'Poolside cocktail/mocktail bar, peaceful atmosphere'
      }
    ]
  };

  const restaurant = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    ...commonSchemaData,
    'name': 'The Harbor Restaurant',
    'description': 'A relaxing indoor dining area with a variety of Lebanese & international dishes.',
    'openingHours': 'Mo-Su 11:00-18:00',
    'priceRange': '$$',
    'servesCuisine': ['Lebanese', 'International'],
    'acceptsReservations': 'Yes',
    'additionalProperty': [
      {
        '@type': 'PropertyValue',
        'name': 'Dining Options',
        'value': 'Dine-in and takeaway available'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Features',
        'value': 'Covered seating overlooking the slides, family-friendly menu'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Payment Options',
        'value': 'Cash and card payments accepted'
      }
    ]
  };

  const snackBar = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    ...commonSchemaData,
    'name': 'Dessert & Snack Bar',
    'description': 'Craving a sweet treat or a quick snack? We\'ve got you covered.',
    'openingHours': 'Mo-Su 12:00-18:30',
    'priceRange': '$',
    'servesCuisine': ['Desserts', 'Snacks', 'Beverages'],
    'additionalProperty': [
      {
        '@type': 'PropertyValue',
        'name': 'Menu Items',
        'value': 'Waffles, churros, crepes, ice cream, cotton candy'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Beverages',
        'value': 'Smoothies, juices, cold drinks'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Specials',
        'value': 'Seasonal specials and bundle offers available'
      }
    ]
  };

  const shop = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    ...commonSchemaData,
    'name': 'Boutique Shop',
    'description': 'Grab your summer essentials, souvenirs, or Waterland merch.',
    'openingHours': 'Mo-Su 10:30-18:00',
    'priceRange': '$$',
    'paymentAccepted': 'Cash, Credit Card',
    'additionalProperty': [
      {
        '@type': 'PropertyValue',
        'name': 'Products',
        'value': 'Swimwear, sunblock, toys, flip-flops, floaties'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Merchandise',
        'value': 'Waterland-branded merch (towels, caps, bottles)'
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(waterpark) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(kidsSplash) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vipPool) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurant) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(snackBar) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shop) }}
      />
    </>
  );
};

export default AttractionSchema;