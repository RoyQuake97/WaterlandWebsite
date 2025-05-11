import React from 'react';
import { commonSchemaData } from '@/lib/seo/keywords';

/**
 * Schema markup for the careers page
 * This helps search engines understand the job posting information
 */
const JobPostingSchema: React.FC = () => {
  const jobPostings = [
    {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      ...commonSchemaData,
      title: 'Lifeguard',
      description: 'We are seeking experienced lifeguards to ensure the safety of our waterpark guests. Responsibilities include monitoring swimming areas, enforcing safety rules, and responding to emergencies.',
      datePosted: '2025-05-01',
      employmentType: 'SEASONAL',
      hiringOrganization: {
        '@type': 'Organization',
        name: 'Waterland Resort & Waterpark',
        sameAs: 'https://waterlandresort.com'
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Zgharta Road',
          addressLocality: 'Zgharta',
          addressRegion: 'North Governorate',
          addressCountry: 'Lebanon'
        }
      },
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: {
          '@type': 'QuantitativeValue',
          value: 1200,
          unitText: 'MONTH'
        }
      },
      qualifications: 'Current lifeguard certification, CPR/First Aid certification, excellent swimming skills, minimum 1 year experience',
      skills: 'Water safety, emergency response, customer service, team player',
      workHours: '8-hour shifts, weekends required'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      ...commonSchemaData,
      title: 'Front Desk Receptionist',
      description: 'We are looking for a friendly and organized Front Desk Receptionist to welcome guests to our resort and manage check-in/check-out procedures.',
      datePosted: '2025-04-15',
      employmentType: 'FULL_TIME',
      hiringOrganization: {
        '@type': 'Organization',
        name: 'Waterland Resort & Waterpark',
        sameAs: 'https://waterlandresort.com'
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Zgharta Road',
          addressLocality: 'Zgharta',
          addressRegion: 'North Governorate',
          addressCountry: 'Lebanon'
        }
      },
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: {
          '@type': 'QuantitativeValue',
          value: 1000,
          unitText: 'MONTH'
        }
      },
      qualifications: 'Hotel or customer service experience preferred, high school diploma or equivalent',
      skills: 'Customer service, communication, organization, computer literacy',
      workHours: 'Various shifts, including weekends and holidays'
    }
  ];

  return (
    <>
      {jobPostings.map((job, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(job) }}
        />
      ))}
    </>
  );
};

export default JobPostingSchema;