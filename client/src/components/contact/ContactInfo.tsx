const ContactInfo = () => {
  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-[#0a4b78] mb-6 font-montserrat">Reach Us</h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#00c6ff] bg-opacity-10 flex items-center justify-center">
              <i className="fas fa-map-marker-alt text-[#00c6ff]"></i>
            </div>
            <div className="ml-4">
              <h4 className="text-md font-semibold text-[#0a4b78]">Address</h4>
              <p className="text-gray-600">
                <a href="https://maps.app.goo.gl/SJjCgzuxUXkuaTwx8" target="_blank" rel="noopener noreferrer" className="hover:text-waterland-blue transition-colors">
                  Zghartā, North Lebanon
                </a>
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#00c6ff] bg-opacity-10 flex items-center justify-center">
              <i className="fas fa-phone-alt text-[#00c6ff]"></i>
            </div>
            <div className="ml-4">
              <h4 className="text-md font-semibold text-[#0a4b78]">Phone</h4>
              <p className="text-gray-600">+961 70 510 510</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#00c6ff] bg-opacity-10 flex items-center justify-center">
              <i className="fab fa-whatsapp text-[#00c6ff]"></i>
            </div>
            <div className="ml-4">
              <h4 className="text-md font-semibold text-[#0a4b78]">WhatsApp</h4>
              <a href="https://wa.me/96170510510" className="text-[#6dcf94] hover:underline">Message us on WhatsApp</a>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#00c6ff] bg-opacity-10 flex items-center justify-center">
              <i className="far fa-clock text-[#00c6ff]"></i>
            </div>
            <div className="ml-4">
              <h4 className="text-md font-semibold text-[#0a4b78]">Operating Hours</h4>
              <p className="text-gray-600">Daily: 10:00 AM - 7:00 PM</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h4 className="text-md font-semibold text-[#0a4b78] mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="h-10 w-10 rounded-full bg-pink-600 flex items-center justify-center text-white hover:bg-pink-700 transition-colors">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>
      
      {/* Google Map */}
      <div className="h-80 rounded-lg overflow-hidden shadow-lg">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.5475054914154!2d35.914885999999996!3d34.406881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1521f6027c540115%3A0xc616465471c1d075!2sWaterland%20Resort%20%26%20Waterpark!5e1!3m2!1sen!2slb!4v1746522112499!5m2!1sen!2slb" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy"
          title="Waterland Resort & Waterpark Location"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactInfo;
