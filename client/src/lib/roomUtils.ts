interface RoomOption {
  room: string;
  price: number;
  isRecommended?: boolean;
  error?: string;
}

/**
 * Determine available room options based on party configuration
 * @param adults Number of adults
 * @param helpers Number of helpers
 * @param numKids Total number of children
 * @param kidAges Array of ages for each child
 * @returns Array of available room options with pricing
 */
export function getRoomOptions(
  adults: number,
  helpers: number,
  numKids: number, 
  kidAges: number[]
): RoomOption[] {
  // Validate kid ages array matches number of kids
  const validKidAges = kidAges.slice(0, numKids);
  while (validKidAges.length < numKids) {
    validKidAges.push(0); // Add default age if array too short
  }

  const roomOptions: RoomOption[] = [];
  let recommendedRoomFound = false;

  // Check Junior Room eligibility
  const isJuniorEligible = 
    (adults === 2 && helpers === 0 && numKids === 0) ||
    (adults === 0 && helpers === 2 && numKids === 0) ||
    (adults === 2 && helpers === 0 && numKids === 1 && validKidAges[0] < 16) ||
    (adults === 2 && helpers === 0 && numKids === 2 && validKidAges.every(age => age < 8));

  if (isJuniorEligible) {
    roomOptions.push({ 
      room: "Junior", 
      price: 250,
      isRecommended: true 
    });
    recommendedRoomFound = true;
  }

  // Check Twin Room eligibility
  const isTwinEligible = 
    (adults === 2 && helpers === 0 && numKids === 2 && validKidAges.every(age => age < 16)) ||
    (adults === 2 && helpers === 0 && numKids === 3 && validKidAges.every(age => age < 12)) ||
    (adults === 2 && helpers === 1 && numKids === 1 && validKidAges[0] < 10);

  if (isTwinEligible) {
    roomOptions.push({ 
      room: "Twin", 
      price: 300,
      isRecommended: !recommendedRoomFound
    });
    if (!recommendedRoomFound) {
      recommendedRoomFound = true;
    }
  }

  // Check Ambassador Room eligibility - base price
  const isAmbassadorBaseEligible = 
    (adults === 2 && helpers === 0 && numKids === 3 && validKidAges.every(age => age < 18));

  if (isAmbassadorBaseEligible) {
    roomOptions.push({ 
      room: "Ambassador", 
      price: 350,
      isRecommended: !recommendedRoomFound
    });
    if (!recommendedRoomFound) {
      recommendedRoomFound = true;
    }
  }

  // Check Ambassador Room eligibility - with $50 surcharge
  const isAmbassadorPlus50Eligible = 
    (adults === 2 && helpers === 0 && numKids === 4 && validKidAges.every(age => age < 18)) ||
    (adults === 2 && helpers === 1 && numKids === 3 && validKidAges.every(age => age < 18));

  if (isAmbassadorPlus50Eligible) {
    roomOptions.push({ 
      room: "Ambassador", 
      price: 400,
      isRecommended: !recommendedRoomFound
    });
    if (!recommendedRoomFound) {
      recommendedRoomFound = true;
    }
  }

  // Check Ambassador Room eligibility - with $100 surcharge
  const isAmbassadorPlus100Eligible = 
    (adults === 2 && helpers === 1 && numKids === 4 && validKidAges.every(age => age < 18));

  if (isAmbassadorPlus100Eligible) {
    roomOptions.push({ 
      room: "Ambassador", 
      price: 450,
      isRecommended: !recommendedRoomFound
    });
    if (!recommendedRoomFound) {
      recommendedRoomFound = true;
    }
  }

  // If no specific configuration matches, make a general suggestion based on party size
  if (roomOptions.length === 0) {
    const totalGuests = adults + helpers + numKids;
    
    if (totalGuests <= 2) {
      roomOptions.push({ 
        room: "Junior", 
        price: 250,
        isRecommended: true
      });
    } else if (totalGuests <= 4) {
      roomOptions.push({ 
        room: "Twin", 
        price: 300,
        isRecommended: true
      });
    } else if (totalGuests <= 6) {
      roomOptions.push({ 
        room: "Ambassador", 
        price: 350,
        isRecommended: true
      });
    } else {
      // For very large groups
      roomOptions.push({ 
        room: "Ambassador", 
        price: 350 + (50 * Math.max(0, totalGuests - 6)),
        isRecommended: true,
        error: "Extra charges may apply for larger groups. Please contact us directly for assistance."
      });
    }
  }

  return roomOptions;
}

/**
 * Legacy function for backward compatibility
 * Returns only the best matching room configuration
 * @param adults Number of adults
 * @param helpers Number of helpers
 * @param numKids Total number of children
 * @param kidAges Array of ages for each child
 * @returns Single best matching room option
 */
export function getRoomConfiguration(
  adults: number,
  helpers: number,
  numKids: number, 
  kidAges: number[]
): { room: string | null; price?: number; error?: string } {
  const options = getRoomOptions(adults, helpers, numKids, kidAges);
  
  // Find recommended option or take the first one
  const recommended = options.find(option => option.isRecommended) || options[0];
  
  if (!recommended) {
    return { 
      room: null, 
      error: "No matching room configuration found. Please contact us for assistance." 
    };
  }
  
  return { 
    room: recommended.room, 
    price: recommended.price,
    error: recommended.error
  };
}