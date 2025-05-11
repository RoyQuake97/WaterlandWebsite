import { useState } from "react";
import FoodMenu from "@/components/menu/FoodMenu";
import DrinkMenu from "@/components/menu/DrinkMenu";
import SEO from "@/components/seo/SEO";
import RestaurantSchema from "@/components/seo/RestaurantSchema";
import { menuKeywords } from "@/lib/seo/keywords";

const Menu = () => {
  const [activeTab, setActiveTab] = useState<'food' | 'drinks'>('food');

  return (
    <section className="py-16 bg-white">
      <SEO 
        title="Waterland Restaurant & Bar Menu"
        description="Discover delicious Lebanese and international cuisine at Waterland Resort. Enjoy fresh food and refreshing drinks with waterpark views in Zgharta, Lebanon."
        keywords={menuKeywords.join(', ')}
        canonicalUrl="/menu"
      />
      <RestaurantSchema />
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a4b78] mb-4 font-montserrat">Dining Experience</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Enjoy delicious food and refreshing drinks at our restaurant and bars located throughout the resort.
          </p>
        </div>
        
        {/* Menu Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center border-b">
            <button 
              className={`menu-tab px-6 py-3 font-semibold ${
                activeTab === 'food' 
                  ? 'text-[#00c6ff] border-b-2 border-[#00c6ff]' 
                  : 'text-gray-500 hover:text-[#00c6ff]'
              }`}
              onClick={() => setActiveTab('food')}
            >
              Food Menu
            </button>
            <button 
              className={`menu-tab px-6 py-3 font-semibold ${
                activeTab === 'drinks' 
                  ? 'text-[#00c6ff] border-b-2 border-[#00c6ff]' 
                  : 'text-gray-500 hover:text-[#00c6ff]'
              }`}
              onClick={() => setActiveTab('drinks')}
            >
              Cocktails & Mocktails
            </button>
          </div>
        </div>
        
        {/* Food Menu Tab */}
        <div className={activeTab === 'food' ? 'block' : 'hidden'}>
          <FoodMenu />
        </div>
        
        {/* Drinks Menu Tab */}
        <div className={activeTab === 'drinks' ? 'block' : 'hidden'}>
          <DrinkMenu />
          
          <div className="text-center mt-12">
            <a 
              href="#" 
              className="inline-block bg-[#0a4b78] hover:bg-blue-900 text-white font-bold py-2 px-6 rounded transition-colors"
            >
              <i className="fas fa-download mr-2"></i>Download Full Menu
            </a>
          </div>
        </div>
        
        {/* Special Diets Section */}
        <div className="mt-16 bg-[#f5f1e9] rounded-lg p-6 md:p-8">
          <h3 className="text-2xl font-bold text-[#0a4b78] mb-4 font-montserrat text-center">Special Dietary Needs</h3>
          <p className="text-gray-600 text-center mb-6">
            We understand that many guests have specific dietary requirements. Our kitchen can accommodate various needs.
            Please inform our staff about any allergies or dietary restrictions.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                <i className="fas fa-leaf text-[#6dcf94]"></i>
              </div>
              <span className="text-sm text-gray-700">Vegetarian</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                <i className="fas fa-seedling text-[#6dcf94]"></i>
              </div>
              <span className="text-sm text-gray-700">Vegan</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                <i className="fas fa-wheat-awn-circle-exclamation text-[#6dcf94]"></i>
              </div>
              <span className="text-sm text-gray-700">Gluten-Free</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                <i className="fas fa-ban text-[#6dcf94]"></i>
              </div>
              <span className="text-sm text-gray-700">Nut-Free</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;
