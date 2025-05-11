import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

const PricingCards = () => {
  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ['/api/site-settings'],
  });

  if (isLoading) {
    return <div>Loading pricing information...</div>;
  }

  const generalPrice = siteSettings?.generalTicketPrice || 20;
  const vipPrice = siteSettings?.vipTicketPrice || 25;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* General Access Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transition duration-300 transform hover:scale-105">
        <div className="bg-[#00c6ff] p-4">
          <h4 className="text-white font-bold text-xl text-center">General Access</h4>
        </div>
        <div className="p-6 text-center">
          <div className="text-4xl font-bold text-[#0a4b78] mb-4">${generalPrice}</div>
          <p className="text-gray-600 mb-4">Per person, all ages</p>
          <ul className="text-left text-gray-600 mb-6 space-y-2">
            <li className="flex items-start">
              <i className="fas fa-check-circle text-[#6dcf94] mt-1 mr-2"></i>
              <span>Access to all slides</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle text-[#6dcf94] mt-1 mr-2"></i>
              <span>Swimming pools</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle text-[#6dcf94] mt-1 mr-2"></i>
              <span>Lounge chairs</span>
            </li>
          </ul>
          <Link href="/contact">
            <a className="inline-block bg-[#00c6ff] hover:bg-blue-600 text-white font-bold py-2 px-6 rounded transition-colors">
              Book Tickets
            </a>
          </Link>
        </div>
      </div>
      
      {/* VIP Pool Access Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transition duration-300 transform hover:scale-105">
        <div className="bg-[#0a4b78] p-4">
          <h4 className="text-white font-bold text-xl text-center">VIP Pool Access</h4>
        </div>
        <div className="p-6 text-center">
          <div className="text-4xl font-bold text-[#0a4b78] mb-4">${vipPrice}</div>
          <p className="text-gray-600 mb-4">Per person, all ages</p>
          <ul className="text-left text-gray-600 mb-6 space-y-2">
            <li className="flex items-start">
              <i className="fas fa-check-circle text-[#6dcf94] mt-1 mr-2"></i>
              <span>All general access features</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle text-[#6dcf94] mt-1 mr-2"></i>
              <span>Exclusive VIP pool</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle text-[#6dcf94] mt-1 mr-2"></i>
              <span>Priority service</span>
            </li>
          </ul>
          <Link href="/contact">
            <a className="inline-block bg-[#0a4b78] hover:bg-blue-900 text-white font-bold py-2 px-6 rounded transition-colors">
              Book VIP
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PricingCards;
