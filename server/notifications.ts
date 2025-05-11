import twilio from 'twilio';
import { Reservation } from '@shared/schema';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
// Use the Twilio WhatsApp sandbox number or the environment variable
const twilioWhatsappNumber = "+14155238886"; // This is the hardcoded Twilio WhatsApp sandbox number

// Check if Twilio configuration is available
const isTwilioConfigured = accountSid && authToken;

// Create Twilio client if credentials are configured
const twilioClient = isTwilioConfigured ? twilio(accountSid, authToken) : null;

/**
 * Format a reservation into a readable message
 */
function formatReservationMessage(reservation: Reservation): string {
  const nights = calculateNights(reservation.checkInDate, reservation.checkOutDate);
  const totalPrice = calculateTotalPrice(reservation.roomType, nights);
  
  return `🏨 New Reservation at Waterland Resort\n\n` +
    `Name: ${reservation.fullName}\n` +
    `Phone: ${reservation.phoneNumber}\n` +
    `Email: ${reservation.email}\n` +
    `Room: ${formatRoomType(reservation.roomType)}\n` +
    `Check-in: ${formatDate(reservation.checkInDate)}\n` +
    `Check-out: ${formatDate(reservation.checkOutDate)}\n` +
    `Guests: ${reservation.adults} adults, ${reservation.children} children\n` +
    `Duration: ${nights} night${nights !== 1 ? 's' : ''}\n` +
    `Total Price: $${totalPrice}\n` +
    `${reservation.specialRequests ? `Special Requests: ${reservation.specialRequests}\n` : ''}` +
    `\nReservation ID: #${reservation.id}`;
}

// WhatsApp specific formatting with bold markdown
function formatWhatsAppMessage(reservation: Reservation): string {
  const nights = calculateNights(reservation.checkInDate, reservation.checkOutDate);
  const totalPrice = calculateTotalPrice(reservation.roomType, nights);
  
  return `🏨 *New Reservation at Waterland Resort*\n\n` +
    `*Name:* ${reservation.fullName}\n` +
    `*Phone:* ${reservation.phoneNumber}\n` +
    `*Email:* ${reservation.email}\n` +
    `*Room:* ${formatRoomType(reservation.roomType)}\n` +
    `*Check-in:* ${formatDate(reservation.checkInDate)}\n` +
    `*Check-out:* ${formatDate(reservation.checkOutDate)}\n` +
    `*Guests:* ${reservation.adults} adults, ${reservation.children} children\n` +
    `*Duration:* ${nights} night${nights !== 1 ? 's' : ''}\n` +
    `*Total Price:* $${totalPrice}\n` +
    `${reservation.specialRequests ? `*Special Requests:* ${reservation.specialRequests}\n` : ''}` +
    `\n*Reservation ID:* #${reservation.id}`;
}

/**
 * Send a WhatsApp notification about a new reservation
 */
export async function sendReservationNotification(
  reservation: Reservation, 
  recipientNumber: string
): Promise<{ success: boolean; message: string; method?: string }> {
  // Send via WhatsApp if configured
  if (isTwilioConfigured) {
    try {
      const whatsAppResult = await sendWhatsAppNotification(reservation, recipientNumber);
      if (whatsAppResult.success) {
        return { ...whatsAppResult, method: 'whatsapp' };
      }
    } catch (error) {
      console.error("WhatsApp notification error:", error);
    }
  }
  
  // If we get here, WhatsApp failed or Twilio is not configured
  console.warn("WhatsApp notification failed or not configured");
  return { 
    success: false,
    message: "WhatsApp notification could not be sent. Check Twilio configuration."
  };
}

/**
 * Send a WhatsApp notification about a new reservation
 */
async function sendWhatsAppNotification(
  reservation: Reservation, 
  recipientNumber: string
): Promise<{ success: boolean; message: string }> {
  // Format recipient number (ensure it has "whatsapp:" prefix)
  const formattedRecipientNumber = formatWhatsAppNumber(recipientNumber);
  
  // If Twilio is not configured, return error
  if (!twilioClient || !twilioWhatsappNumber) {
    return { 
      success: false,
      message: "WhatsApp notifications not configured"
    };
  }
  
  try {
    // Prepare and send the message
    const messageBody = formatWhatsAppMessage(reservation);
    
    // Ensure the from number has the whatsapp: prefix
    const formattedFromNumber = formatWhatsAppNumber(twilioWhatsappNumber);
    
    console.log("Sending WhatsApp message:", {
      from: formattedFromNumber,
      to: formattedRecipientNumber
    });
    
    await twilioClient.messages.create({
      body: messageBody,
      from: formattedFromNumber,
      to: formattedRecipientNumber
    });
    
    return {
      success: true,
      message: "WhatsApp notification sent successfully"
    };
  } catch (error) {
    console.error("Failed to send WhatsApp notification:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    };
  }
}



// Helper functions
function formatWhatsAppNumber(phoneNumber: string): string {
  // First strip any 'whatsapp:' prefix if it exists
  let cleanNumber = phoneNumber.replace('whatsapp:', '');
  
  // Ensure number includes the + symbol for international format
  if (!cleanNumber.startsWith('+')) {
    cleanNumber = `+${cleanNumber}`;
  }
  
  // Add the whatsapp: prefix that Twilio requires
  return `whatsapp:${cleanNumber}`;
}

function formatRoomType(roomType: string): string {
  // Capitalize the first letter and format room type name
  return roomType.charAt(0).toUpperCase() + roomType.slice(1) + ' Room';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

function calculateNights(checkInDate: string, checkOutDate: string): number {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diffTime = checkOut.getTime() - checkIn.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function calculateTotalPrice(roomType: string, nights: number): number {
  // Base prices for room types
  const prices = {
    junior: 250,
    twin: 300,
    ambassador: 350
  };
  
  const basePrice = prices[roomType as keyof typeof prices] || 250;
  return basePrice * nights;
}