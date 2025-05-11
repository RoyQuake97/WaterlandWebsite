import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SiteSettings } from "@shared/schema";

const siteSettingsSchema = z.object({
  announcementText: z.string().max(200, "Announcement text cannot exceed 200 characters"),
  showAnnouncement: z.boolean(),
  openingHours: z.string().min(1, "Opening hours are required"),
  generalTicketPrice: z.coerce.number().min(1, "Price must be at least 1"),
  vipTicketPrice: z.coerce.number().min(1, "Price must be at least 1"),
  juniorRoomPrice: z.coerce.number().min(1, "Price must be at least 1"),
  twinRoomPrice: z.coerce.number().min(1, "Price must be at least 1"),
  ambassadorRoomPrice: z.coerce.number().min(1, "Price must be at least 1"),
  isHiringActive: z.boolean(),
});

type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: siteSettings, isLoading } = useQuery<SiteSettings>({
    queryKey: ['/api/site-settings'],
  });

  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      announcementText: siteSettings?.announcementText || "",
      showAnnouncement: siteSettings?.showAnnouncement || false,
      openingHours: siteSettings?.openingHours || "10:00 AM - 7:00 PM",
      generalTicketPrice: siteSettings?.generalTicketPrice || 20,
      vipTicketPrice: siteSettings?.vipTicketPrice || 25,
      juniorRoomPrice: siteSettings?.juniorRoomPrice || 250,
      twinRoomPrice: siteSettings?.twinRoomPrice || 300,
      ambassadorRoomPrice: siteSettings?.ambassadorRoomPrice || 350,
      isHiringActive: siteSettings?.isHiringActive || false,
    },
  });

  // Update form when settings data is loaded
  useEffect(() => {
    if (siteSettings) {
      form.reset({
        announcementText: siteSettings.announcementText || "",
        showAnnouncement: siteSettings.showAnnouncement,
        openingHours: siteSettings.openingHours,
        generalTicketPrice: siteSettings.generalTicketPrice,
        vipTicketPrice: siteSettings.vipTicketPrice,
        juniorRoomPrice: siteSettings.juniorRoomPrice,
        twinRoomPrice: siteSettings.twinRoomPrice,
        ambassadorRoomPrice: siteSettings.ambassadorRoomPrice,
        isHiringActive: siteSettings.isHiringActive,
      });
    }
  }, [siteSettings, form]);

  const onSubmit = async (data: SiteSettingsFormValues) => {
    try {
      await apiRequest('PATCH', '/api/site-settings', data);
      
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      
      toast({
        title: "Settings Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to Update Settings",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00c6ff] mx-auto mb-4"></div>
        <p className="text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Site Settings</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Announcement Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Announcement Bar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="showAnnouncement"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show Announcement</FormLabel>
                      <FormDescription>
                        Toggle the visibility of the top announcement bar.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="announcementText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Announcement Text</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter announcement text here" 
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This text will appear in the announcement bar at the top of the site.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Opening Hours and Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Hours & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="openingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Hours</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 10:00 AM - 7:00 PM" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="generalTicketPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>General Ticket Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" step="1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vipTicketPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VIP Ticket Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" step="1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="juniorRoomPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Junior Room Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" step="1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="twinRoomPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twin Room Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" step="1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ambassadorRoomPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ambassador Room Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" step="1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Careers Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Careers</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="isHiringActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Hiring Status</FormLabel>
                      <FormDescription>
                        Show or hide the careers section and "Now Hiring" badge.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Button type="submit" className="bg-[#00c6ff] hover:bg-blue-600">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Settings;
