import { useState } from "react";
import { Room } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import BookingProgressTracker from "./BookingProgressTracker";
import { AvailabilityDatePicker } from "./AvailabilityDatePicker";
import RoomSchema from "@/components/seo/RoomSchema";
import WaterlandLoader from "@/components/ui/WaterlandLoader";
import { getRoomOptions } from "@/lib/roomUtils";
import { getRoomImages, getRoomImageCount } from "@/lib/roomImageLoader";
// Carousel components already imported on line 4

interface RoomCardProps {
  room: Room;
}

const bookingSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phoneNumber: z.string().min(5, "Phone number is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  checkInDate: z.string().min(1, "Check-in date is required"),
  numberOfNights: z.string().min(1, "Number of nights is required"),
  adults: z.string().min(1, "Number of adults is required"),
  children: z.string().min(1, "Number of children is required"),
  helpers: z.string().default("0"),
  childAge1: z.string().optional(),
  childAge2: z.string().optional(),
  childAge3: z.string().optional(),
  childAge4: z.string().optional(),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const RoomCard = ({ room }: RoomCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showChildAge1, setShowChildAge1] = useState(false);
  const [showChildAge2, setShowChildAge2] = useState(false);
  const [showChildAge3, setShowChildAge3] = useState(false);
  const [showChildAge4, setShowChildAge4] = useState(false);
  const [extraCharge, setExtraCharge] = useState(0);
  const [selectedRoomType, setSelectedRoomType] = useState("junior");
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [forceUpdate, setForceUpdate] = useState(0); // Add state to force re-render
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state
  const totalSteps = 4;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      checkInDate: "",
      numberOfNights: "1",
      adults: "2", // Default to 2 adults as per room assignment rules
      children: "0",
      helpers: "0",
      childAge1: "",
      childAge2: "",
      childAge3: "",
      childAge4: "",
      specialRequests: "",
    },
  });

  // Watch for form changes in real-time
  const watchedValues = form.watch();

  // Calculate total price based on room price, number of nights, rooms, and extra charges
  const calculateTotalPrice = () => {
    // Parse number of nights as integer with fallback to 1
    const numNights = parseInt(watchedValues.numberOfNights || "1");

    // Get the base price for the selected room type
    let basePrice = room.pricePerNight;
    if (selectedRoomType === "junior") {
      basePrice = 250;
    } else if (selectedRoomType === "twin") {
      basePrice = 300;
    } else if (selectedRoomType === "ambassador") {
      basePrice = 350;
    }

    // Calculate the total with extra charges
    const total = (basePrice + extraCharge) * numNights * numberOfRooms;

    // Return the calculated total
    return total;
  };

  // Handle changes to number of adults
  const handleAdultsChange = (value: string) => {
    const numAdults = parseInt(value);
    form.setValue("adults", value);

    // Update room type based on new number of adults, existing children, and helpers
    updateRoomAssignment(
      numAdults, 
      parseInt(form.getValues("children") || "0"),
      parseInt(form.getValues("helpers") || "0")
    );
  };

  // Handle changes to number of helpers
  const handleHelpersChange = (value: string) => {
    const numHelpers = parseInt(value);
    form.setValue("helpers", value);

    // Update room type based on existing adults, children, and new number of helpers
    updateRoomAssignment(
      parseInt(form.getValues("adults") || "2"),
      parseInt(form.getValues("children") || "0"),
      numHelpers
    );
  };

  // Handle showing/hiding child age inputs based on number of children
  const handleChildrenChange = (value: string) => {
    const numChildren = parseInt(value);
    form.setValue("children", value);

    setShowChildAge1(numChildren >= 1);
    setShowChildAge2(numChildren >= 2);
    setShowChildAge3(numChildren >= 3);
    setShowChildAge4(numChildren >= 4);

    // Update room type based on existing adults, new number of children, and helpers
    updateRoomAssignment(
      parseInt(form.getValues("adults") || "2"), 
      numChildren,
      parseInt(form.getValues("helpers") || "0")
    );
  };

  // Enhanced room assignment logic using roomUtils
  const [availableRoomOptions, setAvailableRoomOptions] = useState<Array<{
    room: string;
    price: number;
    isRecommended?: boolean;
    error?: string;
  }>>([]);

  // Complex room assignment logic based on adults, children, and helpers
  const updateRoomAssignment = (numAdults: number, numChildren: number, numHelpers: number) => {
    // Always use 1 room
    setNumberOfRooms(1);

    // Reset any extra charges
    setExtraCharge(0);

    // Get child ages from form
    const childAge1 = parseInt(form.getValues("childAge1") || "0");
    const childAge2 = parseInt(form.getValues("childAge2") || "0");
    const childAge3 = parseInt(form.getValues("childAge3") || "0");
    const childAge4 = parseInt(form.getValues("childAge4") || "0");

    // Create array of child ages for the algorithm
    const kidAges = [childAge1, childAge2, childAge3, childAge4]
      .slice(0, numChildren);

    // Use the new roomUtils function to get all viable room options
    const roomOptions = getRoomOptions(numAdults, numHelpers, numChildren, kidAges);

    // Save all options to state for display in the UI
    setAvailableRoomOptions(roomOptions);

    // Find the recommended option or default to the first option
    const recommendedOption = roomOptions.find(option => option.isRecommended) || roomOptions[0];

    if (recommendedOption) {
      // Set the initially selected room type to the recommended one
      const roomType = recommendedOption.room.toLowerCase();
      setSelectedRoomType(roomType);

      // Set any extra charges from the recommended option
      // Extra charges are already baked into the price, but we still track them separately
      const basePrice = roomType === "junior" ? 250 : roomType === "twin" ? 300 : 350;
      setExtraCharge(recommendedOption.price - basePrice);
    } else {
      // Default to junior room if no options are available (shouldn't happen)
      setSelectedRoomType("junior");
    }
  };

  const handleBookNow = () => {
    setIsDialogOpen(true);
  };

  // Handle moving to next step in the booking process
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle moving to previous step in the booking process
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validate current step fields
  const validateStepFields = (): boolean => {
    let isValid = true;

    if (currentStep === 1) {
      // Validate guests
      if (!form.getValues('adults')) {
        form.setError('adults', { message: 'Number of adults is required' });
        isValid = false;
      }

      // For children, we just ensure we have a value (which defaults to "0")
      if (form.getValues('children') === undefined) {
        form.setValue('children', "0");
      }

      // For helpers, we just ensure we have a value (which defaults to "0")
      if (form.getValues('helpers') === undefined) {
        form.setValue('helpers', "0");
      }

      // Validate child ages if children > 0
      const numChildren = parseInt(form.getValues('children') || "0");

      if (numChildren >= 1 && !form.getValues('childAge1')) {
        form.setError('childAge1', { message: 'Child age is required' });
        isValid = false;
      }

      if (numChildren >= 2 && !form.getValues('childAge2')) {
        form.setError('childAge2', { message: 'Child age is required' });
        isValid = false;
      }

      if (numChildren >= 3 && !form.getValues('childAge3')) {
        form.setError('childAge3', { message: 'Child age is required' });
        isValid = false;
      }

      if (numChildren >= 4 && !form.getValues('childAge4')) {
        form.setError('childAge4', { message: 'Child age is required' });
        isValid = false;
      }
    } 
    else if (currentStep === 2) {
      // Validate check-in date and number of nights
      if (!form.getValues('checkInDate')) {
        form.setError('checkInDate', { message: 'Check-in date is required' });
        isValid = false;
      }

      if (!form.getValues('numberOfNights')) {
        form.setError('numberOfNights', { message: 'Number of nights is required' });
        isValid = false;
      }

      // Ensure numberOfNights is at least 1
      const numNights = parseInt(form.getValues('numberOfNights') || "0");
      if (numNights < 1) {
        form.setError('numberOfNights', { message: 'At least 1 night is required' });
        isValid = false;
      }
    }
    else if (currentStep === 3) {
      // Validate personal information
      if (!form.getValues('fullName')) {
        form.setError('fullName', { message: 'Name is required' });
        isValid = false;
      }

      if (!form.getValues('phoneNumber')) {
        form.setError('phoneNumber', { message: 'Phone number is required' });
        isValid = false;
      }

      // Email is optional, so no validation needed here
    }

    return isValid;
  };

  // Handle the next button click (manual validation)
  const handleNextStep = () => {
    if (validateStepFields()) {
      goToNextStep();
    }
  };

  const onSubmit = async (data: BookingFormValues) => {
    try {
      // For any step except the final one, just validate and go to next step
      if (currentStep < totalSteps) {
        if (validateStepFields()) {
          goToNextStep();
        }
        return;
      }

      // Final step (step 4) - Don't submit automatically
      // The "Complete Booking" button will now handle the actual submission
    } catch (error) {
      toast({
        title: "Form Error",
        description: error instanceof Error ? error.message : "Please check your information and try again.",
        variant: "destructive",
      });
    }
  };

  // New function to handle the final submission when "Complete Booking" is clicked
  const handleFinalSubmit = async () => {
    try {
      if (!validateStepFields()) {
        return; // Don't proceed if validation fails
      }

      // Set loading state to true
      setIsSubmitting(true);

      const data = form.getValues();

      // Calculate the checkout date from check-in date and number of nights
      const checkInDate = new Date(data.checkInDate);
      const numNights = parseInt(data.numberOfNights);
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkOutDate.getDate() + numNights);

      // Prepare the reservation data
      const reservationData = {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email || '',
        roomType: selectedRoomType,
        checkInDate: data.checkInDate,
        checkOutDate: checkOutDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        adults: parseInt(data.adults),
        children: parseInt(data.children),
        helpers: parseInt(data.helpers || "0"),
        extraCharge: extraCharge,
        specialRequests: data.specialRequests || '',
        numberOfRooms: numberOfRooms,
        totalPrice: calculateTotalPrice() // Include the total price
      };

      await apiRequest('POST', '/api/reservations', reservationData);

      queryClient.invalidateQueries({ queryKey: ['/api/reservations'] });

      // Show confetti animation after successful booking
      setShowConfetti(true);

      toast({
        title: "Booking Successful",
        description: "Your room has been reserved! We'll contact you shortly to confirm.",
      });

      // Reset form and close dialog after a delay to allow confetti to be visible
      setTimeout(() => {
        form.reset();
        setCurrentStep(1);
        setShowConfetti(false);
        setIsDialogOpen(false);
      }, 2500);
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      // Set loading state back to false
      setIsSubmitting(false);
    }
  };

  // Room images have been removed to improve performance

  // Define occupancy information for each room type
  const occupancyInfo = {
    junior: {
      icon: "👨‍👩‍👧",
      text: "2 adults, 1 child"
    },
    twin: {
      icon: "👨‍👩‍👧‍👦",
      text: "2 adults, 2 children"
    },
    ambassador: {
      icon: "👨‍👩‍👧‍👧",
      text: "2 adults, 3 children"
    }
  };

  return (
    <>
      <RoomSchema room={room} />
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">
        {/* Image Gallery Carousel */}
        <div className="relative">
          <Carousel className="w-full rounded-t-lg">
            <CarouselContent>
              {/* Use the image loader to get room type images */}
              {getRoomImages(room.type).map((imageUrl, index) => (
                <CarouselItem key={`${room.type}-${index}`}>
                  <div className="relative h-64 w-full">
                    <img 
                      src={imageUrl}
                      alt={`${room.title} view ${index + 1}`}
                      className="w-full h-full object-cover rounded-t-lg"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-[#0a4b78] mb-2 font-montserrat">{room.title}</h3>

          {/* Price */}
          <div className="text-2xl font-bold text-[#00c6ff] mb-4">
            ${room.pricePerNight}<span className="text-sm text-gray-500 font-normal">/night</span>
          </div>

          {/* Occupancy with Icon */}
          <div className="flex items-center mb-4 bg-gray-50 p-3 rounded-lg">
            <span className="text-2xl mr-3">
              {occupancyInfo[room.type as keyof typeof occupancyInfo]?.icon || "👨‍👩‍👧"}
            </span>
            <span className="text-gray-700">
              Best fits: {occupancyInfo[room.type as keyof typeof occupancyInfo]?.text || "2 adults, 1 child"}
            </span>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <div className="flex items-center py-2 border-b border-gray-100">
              <i className="fas fa-check text-[#6dcf94] mr-3"></i>
              <span className="text-gray-600">2-day waterpark access</span>
            </div>
            <div className="flex items-center py-2 border-b border-gray-100">
              <i className="fas fa-check text-[#6dcf94] mr-3"></i>
              <span className="text-gray-600">Breakfast included</span>
            </div>
            <div className="flex items-center py-2">
              <i className="fas fa-check text-[#6dcf94] mr-3"></i>
              <span className="text-gray-600">Air conditioning</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden button to trigger booking dialog from "Let Us Recommend One" link */}
      <button 
        id="book-now-trigger" 
        onClick={handleBookNow} 
        className="hidden"
        aria-hidden="true"
      >
        Book Now
      </button>



      {/* Main Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book Your Stay</DialogTitle>
            <DialogDescription>
              Complete the steps below to reserve your room.
            </DialogDescription>
          </DialogHeader>

          {/* Booking Progress Tracker */}
          <BookingProgressTracker currentStep={currentStep} totalSteps={totalSteps} showConfetti={showConfetti} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Step 1: Guests */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="adults"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adults</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              handleAdultsChange(value);
                              field.onChange(value);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="children"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Children</FormLabel>
                          <Select
                            onValueChange={(value) => handleChildrenChange(value)}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mb-2">
                    <FormField
                      control={form.control}
                      name="helpers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Helpers</FormLabel>
                          <Select
                            onValueChange={(value) => handleHelpersChange(value)}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Child Age Selectors (conditionally shown) */}
                  {showChildAge1 && (
                    <FormField
                      control={form.control}
                      name="childAge1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age of Child 1</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Age" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 17 }, (_, i) => (
                                <SelectItem key={i} value={`${i}`}>
                                  {i} {i === 1 ? 'year' : 'years'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  )}

                  {showChildAge2 && (
                    <FormField
                      control={form.control}
                      name="childAge2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age of Child 2</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Age" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 17 }, (_, i) => (
                                <SelectItem key={i} value={`${i}`}>
                                  {i} {i === 1 ? 'year' : 'years'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  )}

                  {showChildAge3 && (
                    <FormField
                      control={form.control}
                      name="childAge3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age of Child 3</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Age" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 17 }, (_, i) => (
                                <SelectItem key={i} value={`${i}`}>
                                  {i} {i === 1 ? 'year' : 'years'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  )}

                  {showChildAge4 && (
                    <FormField
                      control={form.control}
                      name="childAge4"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age of Child 4</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Age" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 17 }, (_, i) => (
                                <SelectItem key={i} value={`${i}`}>
                                  {i} {i === 1 ? 'year' : 'years'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Room Type Selection (with multiple options) */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mt-4">
                    <h3 className="text-lg font-semibold text-waterland-blue mb-2">Available Room Options</h3>
                    <p className="text-gray-700 mb-4">
                      Based on your group composition, we've found the following suitable room options:
                    </p>

                    <div className="space-y-3">
                      {availableRoomOptions.map((option, index) => (
                        <div 
                          key={index}
                          onClick={() => {
                            const roomType = option.room.toLowerCase();
                            setSelectedRoomType(roomType);
                            // Calculate extra charge
                            const basePrice = roomType === "junior" ? 250 : roomType === "twin" ? 300 : 350;
                            setExtraCharge(option.price - basePrice);
                          }}
                          className={`p-3 border rounded-md cursor-pointer transition-colors
                            ${selectedRoomType === option.room.toLowerCase() 
                              ? 'border-waterland-blue bg-blue-100' 
                              : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">
                                {option.room} Room
                              </span>
                              {option.isRecommended && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <span className="font-bold text-waterland-blue">
                              ${option.price}/night
                            </span>
                          </div>

                          {option.error && (
                            <div className="mt-1 text-xs text-yellow-700">
                              Note: {option.error}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {extraCharge > 0 && (
                      <div className="mt-4 py-2 px-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
                        <span className="font-medium text-yellow-700">
                          Note: </span>
                        <span className="text-yellow-800">
                          An additional charge of ${extraCharge} per night applies for your selected room configuration.
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Stay Dates */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="checkInDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Check-in Date</FormLabel>
                          <FormControl onClick={(e) => e.stopPropagation()}>
                            <Input 
                              type="date" 
                              value={field.value} 
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setForceUpdate(prev => prev + 1);
                              }}
                              min={new Date().toISOString().split('T')[0]}
                              className="p-4 h-auto"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="numberOfNights"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Number of Nights</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Force re-render to update price
                              setForceUpdate(prev => prev + 1);
                            }}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((n) => (
                                <SelectItem key={n} value={n.toString()}>
                                  {n} {n === 1 ? 'night' : 'nights'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Show total price based on number of nights */}
                  {watchedValues.numberOfNights && watchedValues.checkInDate && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">
                          {room.title} x {watchedValues.numberOfNights} {parseInt(watchedValues.numberOfNights || "1") === 1 ? 'night' : 'nights'}
                          {numberOfRooms > 1 ? ` x ${numberOfRooms} rooms` : ''}
                        </span>
                        <span className="font-semibold">${room.pricePerNight} x {watchedValues.numberOfNights}{numberOfRooms > 1 ? ` x ${numberOfRooms}` : ''}</span>
                      </div>

                      <div className="flex justify-between mb-2 font-bold text-waterland-blue text-lg">
                        <span>Total Price</span>
                        <span>${calculateTotalPrice()}</span>
                      </div>

                      {numberOfRooms > 1 && (
                        <div className="text-sm text-amber-600 mt-1">
                          Note: Price includes {numberOfRooms} rooms based on your group size
                        </div>
                      )}
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requests</FormLabel>
                        <FormControl>
                          <Input placeholder="Any special requests or accommodations needed?" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {/* Step 3: Personal Information */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+961 ..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" type="email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {/* Step 4: Payment & Confirmation */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="p-5 bg-gradient-to-r from-waterland-blue/10 to-waterland-lightblue/10 rounded-lg border border-blue-100">
                    <h3 className="text-lg font-semibold text-waterland-blue mb-3">Booking Summary</h3>

                    {/* Admin Dashboard Link - Hidden from normal users */}

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{watchedValues.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dates:</span>
                        <span className="font-medium">
                          {watchedValues.checkInDate} for {watchedValues.numberOfNights} {parseInt(watchedValues.numberOfNights || "1") === 1 ? 'night' : 'nights'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room Type:</span>
                        <span className="font-medium capitalize">{selectedRoomType} Room</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guests:</span>
                        <span className="font-medium">
                          {watchedValues.adults} {parseInt(watchedValues.adults) === 1 ? 'Adult' : 'Adults'}, 
                          {' '}{watchedValues.children} {parseInt(watchedValues.children) === 1 ? 'Child' : 'Children'}
                          {parseInt(watchedValues.helpers || "0") > 0 ? 
                            `, ${watchedValues.helpers} ${parseInt(watchedValues.helpers || "0") === 1 ? 'Helper' : 'Helpers'}` : ''}
                        </span>
                      </div>
                      {extraCharge > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Extra Charge:</span>
                          <span className="font-medium text-amber-600">${extraCharge} per night</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Price:</span>
                        <span className="font-medium font-bold text-waterland-blue">${calculateTotalPrice()}</span>
                      </div>
                      {numberOfRooms > 1 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Number of Rooms:</span>
                          <span className="font-medium">{numberOfRooms}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-blue-100">
                      <p className="text-sm text-gray-500 mb-6">
                        By clicking "Complete Booking", you agree to our <a href="/terms" className="text-waterland-blue hover:underline">terms and conditions</a>. 
                        Payment options will be sent to you by WhatsApp soon to confirm your booking.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <DialogFooter className="pt-4 mt-4 border-t flex justify-between">
                {currentStep > 1 ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={goToPreviousStep}
                  >
                    Back
                  </Button>
                ) : (
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                )}

                {currentStep < totalSteps ? (
                  <Button 
                    type="button"
                    onClick={handleNextStep} 
                    className="bg-[#00c6ff] hover:bg-blue-600"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    onClick={handleFinalSubmit}
                    className="bg-[#00c6ff] hover:bg-blue-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <WaterlandLoader size="small" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "Complete Booking"
                    )}
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoomCard;