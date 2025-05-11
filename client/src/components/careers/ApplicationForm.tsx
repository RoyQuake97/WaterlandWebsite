import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const applicationSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phoneNumber: z.string().min(5, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  position: z.string().min(1, "Position is required"),
  coverLetter: z.string().optional(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms" }),
  }),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

const ApplicationForm = () => {
  const { toast } = useToast();
  const [fileName, setFileName] = useState<string | null>(null);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      position: "",
      coverLetter: "",
      termsAccepted: false,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName(null);
    }
  };

  const onSubmit = async (data: ApplicationFormValues) => {
    try {
      const applicationData = {
        ...data,
      };

      // In a real implementation, we would upload the CV file
      // For now, we'll just submit the form data
      await apiRequest('POST', '/api/job-applications', applicationData);
      
      toast({
        title: "Application Submitted",
        description: "Thank you for your application. We'll review it and get back to you soon!",
      });
      
      form.reset();
      setFileName(null);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-[#0a4b78] mb-6 font-montserrat">Application Form</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your.email@example.com" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position Applying For</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="select">Select a position</SelectItem>
                    <SelectItem value="lifeguard">Lifeguard</SelectItem>
                    <SelectItem value="chef">Chef</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="bartender">Bartender</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <div>
            <FormLabel>Upload Your CV</FormLabel>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input 
                type="file" 
                id="resumeUpload" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              <div className="space-y-2">
                <i className="fas fa-file-upload text-gray-400 text-3xl"></i>
                <p className="text-sm text-gray-500">Drag and drop your CV here, or click to browse</p>
                <p className="text-xs text-gray-400">(PDF, DOC, DOCX formats accepted)</p>
              </div>
              {fileName && (
                <div className="mt-2 text-sm text-[#00c6ff]">Selected file: {fileName}</div>
              )}
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="coverLetter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Why would you like to join our team?</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={4} 
                    placeholder="Tell us about your experience and why you want to work with us"
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I consent to Waterland storing my application data for recruitment purposes
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="flex-1 bg-[#6dcf94] hover:bg-green-600 text-white font-bold py-3 px-6 rounded transition-colors"
            >
              Submit Application
            </Button>
            <a 
              href="https://wa.me/96170510510" 
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded transition-colors"
            >
              <i className="fab fa-whatsapp mr-2"></i> WhatsApp
            </a>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ApplicationForm;
