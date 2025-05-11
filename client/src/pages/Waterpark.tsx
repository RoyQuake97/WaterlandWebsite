import { useQuery } from "@tanstack/react-query";
import WaterparkInfo from "@/components/waterpark/WaterparkInfo";
import PricingCards from "@/components/waterpark/PricingCards";
import Guidelines from "@/components/waterpark/Guidelines";
import AttractionsGrid from "@/components/attractions/AttractionsGrid";
import SEO from "@/components/seo/SEO";
import WaterparkSchema from "@/components/seo/WaterparkSchema";
import AttractionSchema from "@/components/seo/AttractionSchema";
import { waterparkKeywords } from "@/lib/seo/keywords";

const Waterpark = () => {
  return (
    <section className="py-16 bg-white">
      <SEO 
        title="Splash into Fun at Waterland Waterpark"
        description="Experience thrilling water slides, lazy river, wave pools, and more at Waterland Waterpark in Zgharta, Lebanon. Perfect for family fun and summer adventures."
        keywords={waterparkKeywords.join(', ')}
        canonicalUrl="/waterpark"
      />
      <WaterparkSchema />
      <AttractionSchema />
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a4b78] mb-4 font-montserrat">Experience the Thrill</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Dive into a world of excitement with our state-of-the-art waterslides, relaxing pools, and endless fun for the entire family.
          </p>
        </div>
        
        {/* WaterparkInfo component with gallery */}
        <WaterparkInfo />
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-[#0a4b78] mb-4 font-montserrat">The Ultimate Water Adventure</h3>
            <p className="text-gray-600 mb-4">
              Welcome to Waterland, Lebanon's premier waterpark destination where adventure meets relaxation. Our park 
              features thrilling water slides, a lazy river, wave pools, and dedicated children's play areas.
            </p>
            <p className="text-gray-600 mb-4">
              Whether you're seeking an adrenaline rush or a peaceful day by the pool, Waterland offers the perfect 
              escape for visitors of all ages.
            </p>
            <div className="bg-[#00c6ff] bg-opacity-10 p-4 rounded-lg border-l-4 border-[#00c6ff]">
              <h4 className="font-bold text-[#0a4b78] mb-2">Opening Hours</h4>
              <p className="text-gray-600">Open daily from 10:00 AM to 7:00 PM</p>
            </div>
          </div>
          
          <div>
            <PricingCards />
          </div>
        </div>
        
        {/* Attractions Section */}
        <AttractionsGrid />
        
        {/* Park Guidelines */}
        <Guidelines />
        
        {/* Water Safety Information */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h3 className="text-2xl font-bold text-[#0a4b78] mb-6 font-montserrat">Water Safety</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-[#0a4b78] mb-3">Safety First</h4>
              <p className="text-gray-600 mb-4">
                At Waterland, your safety is our top priority. Our certified lifeguards are stationed throughout the 
                waterpark to ensure a safe and enjoyable experience for everyone.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <i className="fas fa-shield-alt text-[#6dcf94] mt-1 mr-3"></i>
                  <span>Trained lifeguards on duty at all water attractions</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-shield-alt text-[#6dcf94] mt-1 mr-3"></i>
                  <span>Regular water quality testing</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-shield-alt text-[#6dcf94] mt-1 mr-3"></i>
                  <span>Height restrictions on certain slides for safety</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-shield-alt text-[#6dcf94] mt-1 mr-3"></i>
                  <span>First aid station staffed with medical personnel</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#0a4b78] mb-3">Safety Tips for Guests</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#6dcf94] mt-1 mr-3"></i>
                  <span>Apply sunscreen regularly throughout the day</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#6dcf94] mt-1 mr-3"></i>
                  <span>Stay hydrated by drinking plenty of water</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#6dcf94] mt-1 mr-3"></i>
                  <span>Children under 12 should be supervised at all times</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#6dcf94] mt-1 mr-3"></i>
                  <span>Wear appropriate swimwear for comfort and safety</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#6dcf94] mt-1 mr-3"></i>
                  <span>Follow all posted rules and lifeguard instructions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Waterpark;
