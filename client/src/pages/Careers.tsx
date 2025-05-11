import { useQuery } from "@tanstack/react-query";
import JobListing from "@/components/careers/JobListing";
import ApplicationForm from "@/components/careers/ApplicationForm";
import SEO from "@/components/seo/SEO";
import JobPostingSchema from "@/components/seo/JobPostingSchema";
import { careersKeywords } from "@/lib/seo/keywords";
import { SiteSettings } from "@shared/schema";

const jobListings = [
  {
    title: "Lifeguard",
    type: "Full-time",
    location: "Waterpark",
    description: "Responsible for ensuring the safety of our guests in and around the water attractions. Certification required."
  },
  {
    title: "Chef",
    type: "Full-time",
    location: "Restaurant",
    description: "Creative culinary professional needed to prepare delicious meals for our restaurant. Experience required."
  },
  {
    title: "Receptionist",
    type: "Full-time",
    location: "Hotel",
    description: "Friendly, detail-oriented professional to welcome guests and handle reservations. Customer service experience needed."
  },
  {
    title: "Server",
    type: "Seasonal",
    location: "Restaurant",
    description: "Energetic individuals to provide excellent service to our guests in the restaurant and pool areas."
  },
  {
    title: "Maintenance Technician",
    type: "Full-time",
    location: "Resort",
    description: "Skilled technician needed for general maintenance and repairs throughout the resort."
  },
  {
    title: "Guest Relations",
    type: "Full-time",
    location: "Hotel",
    description: "Customer-focused professional to ensure guest satisfaction and handle special requests or concerns."
  }
];

const Careers = () => {
  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ['/api/site-settings'],
  });

  if (!siteSettings?.isHiringActive) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a4b78] mb-4 font-montserrat">Careers</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're not currently hiring for any positions. Please check back later for opportunities to join our team.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <SEO 
        title="Careers at Waterland Resort & Waterpark"
        description="Join our team at Waterland Resort in Lebanon. Browse current job openings for lifeguards, chefs, servers, and more. Apply online today!"
        keywords={careersKeywords.join(', ')}
        canonicalUrl="/careers"
      />
      <JobPostingSchema />
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#6dcf94] text-white px-4 py-1 rounded-full text-sm font-bold mb-4">NOW HIRING</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a4b78] mb-4 font-montserrat">Join Our Team</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Be part of the excitement at Waterland Resort & Waterpark. We're looking for talented individuals to join our team.
          </p>
        </div>
        
        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {jobListings.map((job, index) => (
            <JobListing
              key={index}
              title={job.title}
              type={job.type}
              location={job.location}
              description={job.description}
            />
          ))}
        </div>
        
        {/* Why Work With Us */}
        <div className="bg-[#f5f1e9] rounded-lg p-6 md:p-8 mb-12">
          <h3 className="text-2xl font-bold text-[#0a4b78] mb-6 font-montserrat text-center">Why Work With Us</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#00c6ff] rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-heart text-white text-2xl"></i>
              </div>
              <h4 className="font-bold text-[#0a4b78] mb-2">Fun Work Environment</h4>
              <p className="text-gray-600">Enjoy working in a vibrant, energetic setting where no two days are the same</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#6dcf94] rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-users text-white text-2xl"></i>
              </div>
              <h4 className="font-bold text-[#0a4b78] mb-2">Great Team Culture</h4>
              <p className="text-gray-600">Be part of a supportive, collaborative team that feels like family</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#0a4b78] rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-chart-line text-white text-2xl"></i>
              </div>
              <h4 className="font-bold text-[#0a4b78] mb-2">Growth Opportunities</h4>
              <p className="text-gray-600">Develop your skills and advance your career with training and mentorship</p>
            </div>
          </div>
        </div>
        
        {/* Job Application Form */}
        <ApplicationForm />
      </div>
    </section>
  );
};

export default Careers;
