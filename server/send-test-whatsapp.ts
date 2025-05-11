import { sendReservationNotification } from './notifications';
import twilio from 'twilio';

async function testNotifications() {
  // Create a sample reservation for testing
  const sampleReservation = {
    id: 9999, // Just a dummy ID for testing
    fullName: "Test Customer",
    phoneNumber: "+1234567890",
    email: "test@example.com",
    roomType: "junior" as "junior" | "twin" | "ambassador", // Type assertion for TypeScript
    checkInDate: "2023-09-01",
    checkOutDate: "2023-09-04",
    adults: 2,
    children: 1,
    specialRequests: "Extra pillows please",
    isPaid: false,
    createdAt: new Date()
  };

  // Get the recipient phone number from environment variables
  const recipientNumber = process.env.RECIPIENT_WHATSAPP_NUMBER;
  
  // For testing, we'll use the correct sandbox number
  const twilioSandboxNumber = "+14155238886"; // This is the Twilio WhatsApp sandbox number
  
  if (!recipientNumber) {
    console.error("No recipient phone number found in environment variables.");
    process.exit(1);
  }

  console.log(`Sending test WhatsApp notification to ${recipientNumber}...`);
  
  try {
    // Test with our manual sandbox number override
    console.log(`Using Twilio sandbox number: ${twilioSandboxNumber} (instead of the env variable: ${process.env.TWILIO_WHATSAPP_NUMBER})`);
    
    // Temporarily override the env variable with a custom function just for testing
    const customSendWhatsApp = async () => {
      try {
        const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const messageBody = "🏨 *Test Message from Waterland Resort*\n\nThis is a test message to verify WhatsApp notifications are working properly.";
        
        console.log("Sending WhatsApp message:", {
          from: `whatsapp:${twilioSandboxNumber}`,
          to: `whatsapp:${recipientNumber}`
        });
        
        await twilioClient.messages.create({
          body: messageBody,
          from: `whatsapp:${twilioSandboxNumber}`,
          to: `whatsapp:${recipientNumber}`
        });
        
        return { success: true, message: "WhatsApp test message sent successfully" };
      } catch (error) {
        console.error("Failed to send WhatsApp test:", error);
        return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
      }
    };
    
    const result = await customSendWhatsApp();
    
    if (result.success) {
      console.log(`✅ Test message sent successfully via WhatsApp!`);
    } else {
      console.error("❌ Failed to send test message:", result.message);
    }
  } catch (error) {
    console.error("❌ Error sending test message:", error);
  }
}

// Run the test
testNotifications();