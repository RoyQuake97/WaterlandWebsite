import { createEvent, EventAttributes } from 'ics';
import { Reservation } from '@shared/schema';
import fs from 'fs';
import path from 'path';

/**
 * Convert a reservation to an iCalendar event
 * 
 * @param reservation The reservation to convert
 * @returns A Promise resolving to the iCalendar content
 */
export async function createCalendarEvent(reservation: Reservation): Promise<string> {
  // Format dates for the event (YYYY-MM-DD format to array format [YYYY, MM, DD])
  const checkInDate = formatDateForICS(reservation.checkInDate);
  const checkOutDate = formatDateForICS(reservation.checkOutDate);
  
  // Create descriptive text for the event
  const description = `
    Waterland Resort & Waterpark Reservation
    
    Guest: ${reservation.fullName}
    Room Type: ${capitalizeFirstLetter(reservation.roomType)} Room
    Number of Guests: ${reservation.adults} adults, ${reservation.children} children
    ${reservation.specialRequests ? `Special Requests: ${reservation.specialRequests}` : ''}
    
    For questions or changes, please contact us at +961 70 123456
  `;
  
  // Create event with details
  const event: EventAttributes = {
    start: checkInDate,
    end: checkOutDate,
    title: `Waterland Resort Stay - ${capitalizeFirstLetter(reservation.roomType)} Room`,
    description: description.trim(),
    location: 'Waterland Resort & Waterpark, Lebanon',
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    organizer: { name: 'Waterland Resort', email: 'bookings@waterlandresort.com' }
  };
  
  // Generate the ics content
  return new Promise((resolve, reject) => {
    createEvent(event, (error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    });
  });
}

/**
 * Generate and save an .ics file for a reservation
 * 
 * @param reservation The reservation to create an .ics file for
 * @returns The path to the generated .ics file
 */
export async function generateICSFile(reservation: Reservation): Promise<string> {
  try {
    // Create events directory if it doesn't exist
    const dirPath = path.join(process.cwd(), 'events');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Generate the content
    const icsContent = await createCalendarEvent(reservation);
    
    // Create a unique filename
    const filename = `reservation_${reservation.id}_${Date.now()}.ics`;
    const filePath = path.join(dirPath, filename);
    
    // Write the file
    fs.writeFileSync(filePath, icsContent);
    
    return filename;
  } catch (error) {
    console.error('Error generating ICS file:', error);
    throw error;
  }
}

/**
 * Helper to format a date string (YYYY-MM-DD) into array format for ics
 */
function formatDateForICS(dateString: string): [number, number, number] {
  const date = new Date(dateString);
  return [
    date.getFullYear(),
    date.getMonth() + 1, // Month is 0-indexed in JS, but we need 1-indexed
    date.getDate()
  ];
}

/**
 * Helper to capitalize the first letter of a string
 */
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}