import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Terms = () => {
  const [refHeader, inViewHeader] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [refContent, inViewContent] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // No longer scrolling to top automatically

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <motion.div
        ref={refHeader}
        initial={{ opacity: 0, y: 20 }}
        animate={inViewHeader ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative py-16 md:py-24 bg-gradient-to-r from-waterland-blue to-waterland-lightblue text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-blue-500 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-50" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Terms and Conditions</h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-white/90">
            Please read these terms carefully before using our services
          </p>
        </div>
        
        <svg
          className="absolute bottom-0 left-0 w-full text-gray-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,128L80,154.7C160,181,320,235,480,234.7C640,235,800,181,960,170.7C1120,160,1280,192,1360,208L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </motion.div>

      {/* Content */}
      <motion.div
        ref={refContent}
        initial={{ opacity: 0 }}
        animate={inViewContent ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="container mx-auto px-4 py-12 md:py-16"
      >
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="prose prose-blue max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By using Waterland Resort & Waterpark's services, including our website, facilities, and booking system, 
              you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of 
              these terms, please do not use our services.
            </p>

            <h2>2. Reservation and Booking</h2>
            <p>
              <strong>2.1 Booking Confirmation:</strong> Your reservation is only confirmed after receiving an 
              official confirmation from Waterland Resort & Waterpark.
            </p>
            <p>
              <strong>2.2 Payment:</strong> Payment options will be sent via WhatsApp after your booking submission. 
              A deposit may be required to secure certain reservations.
            </p>
            <p>
              <strong>2.3 Cancellation Policy:</strong> Cancellations must be made at least 48 hours before the 
              scheduled check-in time for a full refund. Cancellations made less than 48 hours before check-in time 
              may be subject to a charge equivalent to one night's stay.
            </p>

            <h2>3. Rules and Regulations</h2>
            <p>
              <strong>3.1 Check-in/Check-out:</strong> Standard check-in time is 3:00 PM and check-out time is 12:00 PM.
              Early check-in or late check-out may be available upon request and subject to availability.
            </p>
            <p>
              <strong>3.2 Conduct:</strong> Guests are expected to conduct themselves in a reasonable and responsible manner 
              at all times and to respect the comfort and safety of other guests and staff.
            </p>
            <p>
              <strong>3.3 Property Damage:</strong> Guests will be held responsible for any damage caused to the property 
              during their stay and will be charged accordingly.
            </p>

            <h2>4. Waterpark Rules</h2>
            <p>
              <strong>4.1 Safety:</strong> All guests must adhere to safety rules posted throughout the waterpark. 
              Lifeguards' instructions must be followed at all times.
            </p>
            <p>
              <strong>4.2 Child Supervision:</strong> Children under 12 years must be supervised by an adult at all times.
            </p>
            <p>
              <strong>4.3 Prohibited Items:</strong> Glass containers, alcohol, and outside food and beverages are not 
              permitted in the waterpark area.
            </p>

            <h2>5. Liability</h2>
            <p>
              <strong>5.1 Personal Belongings:</strong> Waterland Resort & Waterpark is not responsible for any loss or 
              damage to guests' personal belongings.
            </p>
            <p>
              <strong>5.2 Personal Injury:</strong> Guests use the facilities at their own risk. Waterland Resort & Waterpark 
              is not liable for any injuries sustained while using our facilities, except where such liability cannot be 
              excluded by law.
            </p>

            <h2>6. Privacy Policy</h2>
            <p>
              Your personal information will be handled in accordance with our Privacy Policy, which can be viewed on our website.
            </p>

            <h2>7. Modifications</h2>
            <p>
              Waterland Resort & Waterpark reserves the right to modify these Terms and Conditions at any time. 
              Updated terms will be effective immediately upon posting to our website.
            </p>

            <h2>8. Contact Information</h2>
            <p>
              If you have any questions regarding these Terms and Conditions, please contact us at:
            </p>
            <p>
              Waterland Resort & Waterpark<br />
              Email: info@waterlandresort.com<br />
              Phone: +961 1 234 5678
            </p>

            <p className="text-sm text-gray-500 mt-8">
              Last Updated: May 2, 2025
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;
