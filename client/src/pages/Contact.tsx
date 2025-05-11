import { motion } from "framer-motion";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import GoogleMapEmbed from "@/components/maps/GoogleMapEmbed";
import SEO from "@/components/seo/SEO";
import ContactPageSchema from "@/components/seo/ContactPageSchema";
import { contactKeywords } from "@/lib/seo/keywords";

const Contact = () => {
  return (
    <div>
      <SEO 
        title="Contact Waterland Resort & Waterpark"
        description="Contact our team at Waterland Resort in Zgharta, North Lebanon for reservations, inquiries, and directions. Call +961 70 510 510 or email us."
        keywords={contactKeywords.join(', ')}
        canonicalUrl="/contact"
      />
      <ContactPageSchema />
      <section className="py-16 bg-[#f5f1e9]">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4b78] mb-4 font-montserrat">Contact Us</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get in touch with our team for reservations, inquiries, or any questions you might have.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ContactInfo />
            </motion.div>
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Interactive Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4b78] mb-4 font-montserrat">Visit & Location</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find us in beautiful Zghartā, North Lebanon. We're easily accessible and offer ample parking for guests.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <GoogleMapEmbed 
              title="Waterland Resort & Waterpark"
              description="Plan your visit to Lebanon's premier waterpark resort in Zghartā, North Lebanon"
              height="600px"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
