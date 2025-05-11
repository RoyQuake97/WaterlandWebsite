import { Link } from "wouter";

interface JobProps {
  title: string;
  type: string;
  location: string;
  description: string;
}

const JobListing = ({ title, type, location, description }: JobProps) => {
  return (
    <div className="bg-[#f5f1e9] rounded-lg p-6 shadow-md transition duration-300 transform hover:scale-105">
      <h3 className="text-xl font-bold text-[#0a4b78] mb-3 font-montserrat">{title}</h3>
      <div className="flex items-center mb-4">
        <span className="bg-[#00c6ff] bg-opacity-10 text-[#00c6ff] px-3 py-1 rounded-full text-sm">{type}</span>
        <span className="mx-2">•</span>
        <span className="text-gray-600 text-sm">{location}</span>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <a 
        href="https://wa.me/96170510510" 
        className="inline-flex items-center text-[#6dcf94] hover:text-green-700 font-semibold"
      >
        <i className="fab fa-whatsapp mr-2"></i> Apply via WhatsApp
      </a>
    </div>
  );
};

export default JobListing;
