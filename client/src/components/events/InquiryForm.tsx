import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const eventInquirySchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phoneNumber: z.string().min(5, "Phone number is required"),
  eventType: z.string().min(1, "Event type is required"),
  eventDate: z.string().min(1, "Preferred date is required"),
  numberOfGuests: z.string().min(1, "Number of guests is required"),
  message: z.string().optional(),
});

type EventInquiryValues = z.infer<typeof eventInquirySchema>;

const InquiryForm = () => {
  const { toast } = useToast();

  const form = useForm<EventInquiryValues>({
    resolver: zodResolver(eventInquirySchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      eventType: "",
      eventDate: "",
      numberOfGuests: "",
      message: "",
    },
  });

  const onSubmit = async (data: EventInquiryValues) => {
    try {
      const inquiryData = {
        ...data,
        numberOfGuests: parseInt(data.numberOfGuests),
      };

      await apiRequest('POST', '/api/event-inquiries', inquiryData);
      
      toast({
        title: "Inquiry Sent Successfully",
        description: "Thank you for your interest. We'll get back to you shortly!",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-[#0a4b78] mb-4 font-montserrat">Event Inquiry</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder="+961 ..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="select">Select event type</SelectItem>
                    <SelectItem value="birthday">Birthday Party</SelectItem>
                    <SelectItem value="corporate">Corporate Event</SelectItem>
                    <SelectItem value="celebration">Celebration</SelectItem>
                    <SelectItem value="private">Private Party</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="numberOfGuests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Guests</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Information</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={3} 
                    placeholder="Tell us more about your event and any special requirements"
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-[#00c6ff] hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Submit Inquiry
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InquiryForm;
