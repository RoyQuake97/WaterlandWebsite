import EventGallery from "@/components/events/EventGallery";
import InquiryForm from "@/components/events/InquiryForm";
import SEO from "@/components/seo/SEO";
import EventVenueSchema from "@/components/seo/EventVenueSchema";
import { eventsKeywords } from "@/lib/seo/keywords";

const Events = () => {
  return (
    <section className="py-16 bg-[#f5f1e9]">
      <SEO 
        title="Event & Celebration Venues at Waterland Resort"
        description="Host your birthday party, wedding, corporate event or celebration at Waterland Resort in Lebanon. Beautiful venues, custom packages, and professional planning services."
        keywords={eventsKeywords.join(', ')}
        canonicalUrl="/events"
      />
      <EventVenueSchema />
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a4b78] mb-4 font-montserrat">Events & Celebrations</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Make your special occasions unforgettable with our tailored event packages and beautiful venues.
          </p>
        </div>
        
        {/* Events Gallery */}
        <EventGallery />
        
        {/* Birthday Package Info and Inquiry Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-[#0a4b78] mb-4 font-montserrat">Birthday Packages</h3>
            <p className="text-gray-600 mb-4">
              Celebrate your special day with a splash at Waterland! Our birthday packages include:
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <i className="fas fa-gift text-[#6dcf94] mt-1 mr-3"></i>
                <span className="text-gray-600">Reserved area for your party for up to 3 hours</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-gift text-[#6dcf94] mt-1 mr-3"></i>
                <span className="text-gray-600">Waterpark access for all guests</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-gift text-[#6dcf94] mt-1 mr-3"></i>
                <span className="text-gray-600">Dedicated party host to coordinate activities</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-gift text-[#6dcf94] mt-1 mr-3"></i>
                <span className="text-gray-600">Food and beverage packages available</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-gift text-[#6dcf94] mt-1 mr-3"></i>
                <span className="text-gray-600">Special surprise for the birthday person</span>
              </li>
            </ul>
            
            <p className="text-gray-600">Starting from $25 per person (minimum 10 guests)</p>
            
            {/* Corporate Events */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-[#0a4b78] mb-4 font-montserrat">Corporate Events</h3>
              <p className="text-gray-600 mb-4">
                Looking for a unique venue for your next team building event or company celebration? 
                Waterland offers special corporate packages that can be customized to your needs.
              </p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#6dcf94] mt-1 mr-3"></i>
                  <span className="text-gray-600">Private venue spaces available</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#6dcf94] mt-1 mr-3"></i>
                  <span className="text-gray-600">Team building activities</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#6dcf94] mt-1 mr-3"></i>
                  <span className="text-gray-600">Catering options for all group sizes</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-[#6dcf94] mt-1 mr-3"></i>
                  <span className="text-gray-600">Special group rates</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Event Inquiry Form */}
          <InquiryForm />
        </div>
        
        {/* Testimonials */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h3 className="text-2xl font-bold text-[#0a4b78] mb-6 font-montserrat text-center">What Our Event Guests Say</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#f5f1e9] p-5 rounded-lg relative">
              <div className="text-6xl text-[#00c6ff] opacity-20 absolute top-2 left-2">"</div>
              <p className="text-gray-600 mb-4 relative z-10 italic">
                "We celebrated our daughter's 10th birthday at Waterland and it was amazing! 
                The staff took care of everything and the kids had a blast on the water slides. 
                Would definitely recommend for any birthday party!"
              </p>
              <div className="font-semibold text-[#0a4b78]">- Leila B.</div>
            </div>
            
            <div className="bg-[#f5f1e9] p-5 rounded-lg relative">
              <div className="text-6xl text-[#00c6ff] opacity-20 absolute top-2 left-2">"</div>
              <p className="text-gray-600 mb-4 relative z-10 italic">
                "Our company's summer event at Waterland was a huge success. The team enjoyed 
                the pool activities, and the food was excellent. The event coordinator made 
                planning easy and stress-free."
              </p>
              <div className="font-semibold text-[#0a4b78]">- National Bank of Lebanon</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
