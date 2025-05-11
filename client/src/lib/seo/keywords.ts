/**
 * Comprehensive keyword list for Waterland Resort & Waterpark
 * Organized by page and category for better SEO management
 */

// Common keywords that can be used across the site
export const commonKeywords = [
  // General Resort Keywords
  'Waterland Resort Lebanon',
  'Waterland North Lebanon',
  'Lebanon beach resort',
  'Waterland family resort',
  'Family-friendly resort Lebanon',
  'Best resort in Zgharta',
  'Summer resort Lebanon',
  'Waterland Ardeh resort',
  'Waterland all-inclusive resort',
  'Top summer resorts Lebanon',
  'Affordable resorts Lebanon',
  'Lebanon resort with private rooms',
  'Waterland resort & hotel',
  
  // Location-Based Keywords
  'Waterland Zgharta',
  'Resort near Tripoli Lebanon',
  'Family resort in Ardeh',
  'North Lebanon waterpark',
  'Hotels near Qadisha valley',
  'Zgharta summer resort',
  'Resorts near Batroun or Tripoli',
  
  // Seasonal Keywords
  'Summer 2025 resort Lebanon',
  'Eid holidays in Lebanon resort',
  'Lebanon vacation ideas 2025',
  'Best Lebanon destinations summer',
];

// Page-specific keywords
export const homeKeywords = [
  ...commonKeywords,
  // Family & Activities Keywords
  'Best place for kids in Lebanon',
  'Lebanon family day out',
  'Things to do with kids in North Lebanon',
  'Where to go with kids this summer Lebanon',
  'Family fun park Lebanon',
  'Waterland kids activities',
  'Lebanon summer with family',
  'Family resort for toddlers',
  'Water games for children',
  'Summer with kids Lebanon',
  // User Intent Keywords
  'Where to swim in North Lebanon',
  'Best water resorts for families',
  'Can I book Waterland online?',
  'Is Waterland kid-friendly?',
  'Waterpark open in May Lebanon',
  'What to do with kids in Tripoli',
  'Can I stay overnight in Waterland?',
  'Best hotel with slides for kids Lebanon',
  // Original Keywords
  'Lebanon luxury resort',
  'Lebanon family activities',
  'waterpark attractions Lebanon',
  'Lebanon resort deals',
  'family entertainment Lebanon',
  'Lebanon resort packages',
  'best resort for kids Lebanon',
  'vacation Lebanon with kids',
];

export const waterparkKeywords = [
  ...commonKeywords,
  // Waterpark Specific Keywords
  'Waterpark Lebanon',
  'Waterland waterpark tickets',
  'Best waterpark in Lebanon',
  'Waterland slides and pools',
  'Water slides Lebanon',
  'Waterpark near Tripoli',
  'Water attractions for kids Lebanon',
  'Water games for families Lebanon',
  'Kids waterpark North Lebanon',
  'Water park for adults and kids',
  'Waterpark day pass Lebanon',
  'Waterland splash zone',
  'VIP waterpool Lebanon',
  'Waterpark with lifeguards Lebanon',
  'swimming pools Lebanon',
  'wave pool Lebanon',
  'lazy river attraction',
  'water activities Lebanon',
  'kids water attractions Lebanon',
  'water park tickets Lebanon',
  'family water fun Lebanon',
  'water attractions North Lebanon',
  'Lebanon summer activities',
];

export const hotelKeywords = [
  ...commonKeywords,
  // Hotel & Stay Keywords
  'Hotel with waterpark access Lebanon',
  'Lebanon resort hotel',
  'Waterland hotel Zgharta',
  'Book hotel Waterland',
  'Summer hotel North Lebanon',
  'Hotel with breakfast included Lebanon',
  'Resort hotel with kids activities',
  'Waterland resort prices',
  'Resort with free waterpark',
  'Overnight waterpark package Lebanon',
  'Family hotel North Lebanon',
  'Lebanon vacation resort',
  // Booking & Offers Keywords
  'Waterland reservation online',
  'Waterpark Lebanon booking',
  'Book Waterland online',
  'Lebanon waterpark tickets',
  'Waterland room reservation',
  'Book family room North Lebanon',
  'Waterpark hotel deals Lebanon',
  'Waterland combo offers',
  'Summer deals resort Lebanon',
  'Waterpark room packages',
  'VIP room reservation Lebanon',
  'Resort room availability',
  // Original Keywords
  'resort accommodation Lebanon',
  'luxury rooms Lebanon',
  'family rooms Lebanon',
  'Zgharta hotel booking',
  'resort suites Lebanon',
  'Lebanon resort rooms',
  'Zgharta luxury accommodation',
  'hotel with breakfast Lebanon',
];

export const menuKeywords = [
  ...commonKeywords,
  // Food & Amenities Keywords
  'Pool bar Lebanon',
  'Resort restaurant North Lebanon',
  'Waterland bar menu',
  'Waterland cocktails and mocktails',
  'VIP pool and towel service',
  'Summer drinks by the pool',
  'Outdoor resort café Lebanon', 
  'Dessert bar resort Lebanon',
  'All-day resort dining Lebanon',
  // Original Keywords
  'resort restaurant Lebanon',
  'waterpark dining options',
  'Lebanese cuisine resort',
  'family dining Lebanon resort',
  'resort food options',
  'luxury dining Zgharta',
  'resort catering Lebanon',
];

export const eventsKeywords = [
  ...commonKeywords,
  // Events Specific Keywords
  'Waterland event packages',
  'Birthday parties at Waterland',
  'Corporate events Lebanon resort',
  'Waterland wedding venue',
  'Lebanon resort events',
  'Event venue Lebanon',
  'Wedding venue Zgharta',
  'Corporate events Lebanon',
  'Birthday parties Zgharta',
  'Lebanon event planning',
  'Resort celebrations Lebanon',
  'Outdoor event venue Lebanon',
  'Private events waterpark',
];

export const careersKeywords = [
  ...commonKeywords,
  'resort jobs Lebanon',
  'hospitality careers Lebanon',
  'waterpark employment',
  'Zgharta job opportunities',
  'resort staff positions',
  'tourism jobs Lebanon',
  'resort seasonal work',
];

export const contactKeywords = [
  ...commonKeywords,
  // Contact Specific Keywords
  'Waterland resort contact information',
  'How to reach Waterland resort',
  'Waterland Zgharta location',
  'Beach near Zgharta',
  'Day trip Zgharta Lebanon',
  'Contact Waterland Resort',
  'Waterland Resort location',
  'Directions to Waterland Resort',
  'Resort customer service Lebanon',
  'Waterland Resort phone number',
  'Zgharta resort contacts',
];

export const attractionsKeywords = [
  ...commonKeywords,
  // Attractions Specific Keywords
  'Waterland attractions list',
  'Best water slides in Waterland',
  'Waterland pools and attractions',
  'Waterland wave pool',
  'Kids water attractions Lebanon',
  'Waterpark attractions',
  'Water slides Lebanon',
  'Wave pool attraction',
  'Kids water area',
  'Family water attractions',
  'Thrill water rides Lebanon',
  'Lazy river attraction',
  'Water park facilities Lebanon',
];

// Schema.org types by page
export const schemaTypes = {
  home: 'Resort',
  waterpark: 'WaterPark',
  hotel: 'Hotel',
  menu: 'Restaurant',
  events: 'EventVenue',
  careers: 'EmployerAggregateRating',
  contact: 'LocalBusiness',
  attractions: 'TouristAttraction',
};

// Common Schema.org data
export const commonSchemaData = {
  name: 'Waterland Resort & Waterpark',
  description: 'A premier resort and waterpark in Zgharta, Lebanon, offering luxury accommodations, exciting water attractions, dining options, and event facilities.',
  telephone: '+961 70 510 510',
  email: 'info@waterlandresort.com',
  url: 'https://waterlandresort.com',
  logo: 'https://waterlandresort.com/images/logo.png',
  image: 'https://waterlandresort.com/images/resort-exterior.jpg',
  sameAs: [
    'https://www.facebook.com/WATERLANDLEBANON/',
    'https://www.instagram.com/waterland.lb/'
  ],
  address: {
    '@type': 'PostalAddress',
    'streetAddress': 'Zgharta Road',
    'addressLocality': 'Zgharta',
    'addressRegion': 'North Governorate',
    'addressCountry': 'Lebanon'
  },
  geo: {
    '@type': 'GeoCoordinates',
    'latitude': '34.3979',
    'longitude': '35.8869'
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
      ],
      'opens': '10:00',
      'closes': '19:00'
    }
  ],
};