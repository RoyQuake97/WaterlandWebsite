import React from 'react';
import { commonSchemaData } from '@/lib/seo/keywords';

/**
 * Component for adding contact page specific structured data
 * This helps search engines understand contact information and business hours
 */
const ContactPageSchema: React.FC = () => {
  const contactData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Waterland Resort & Waterpark',
    description: 'Contact information for Waterland Resort & Waterpark in Zgharta, Lebanon including phone numbers, email, directions, and a contact form.',
    mainEntity: {
      '@type': 'LocalBusiness',
      ...commonSchemaData,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+961 70 510 510',
          contactType: 'customer service',
          areaServed: 'Lebanon',
          availableLanguage: ['English', 'Arabic', 'French']
        },
        {
          '@type': 'ContactPoint',
          telephone: '+961 70 510 510',
          contactType: 'reservations',
          areaServed: 'Lebanon',
          availableLanguage: ['English', 'Arabic', 'French']
        }
      ],
      // Extended opening hours for better display in Google
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '10:00',
          closes: '19:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday', 'Sunday'],
          opens: '09:00',
          closes: '20:00'
        }
      ],
      // Special opening hours for holidays or special events
      specialOpeningHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          name: 'New Year\'s Day',
          opens: '12:00',
          closes: '18:00',
          validFrom: '2025-01-01',
          validThrough: '2025-01-01'
        }
      ],
      hasMap: 'https://www.google.com/maps?q=34.3979,35.8869'
    }
  };
  
  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(contactData) }}
    />
  );
};

export default ContactPageSchema;