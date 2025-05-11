import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { StatsCard } from "@/components/admin/stats-card";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { OccupancyHeatmap } from "@/components/admin/occupancy-heatmap";
import { RecentActivity } from "@/components/admin/recent-activity";
import { StatusBadge } from "@/components/ui/status-badge";
import { generateRevenueData } from "@/lib/adminUtils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { format, formatDistance, subDays } from "date-fns";

import { 
  CalendarDays, Clock, Users, DollarSign, Package, HotelIcon, 
  CalendarCheck2, MessageSquare, BriefcaseIcon, TrendingUp
} from "lucide-react";

// Type definitions
interface Reservation {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  specialRequests?: string;
  isPaid: boolean;
  createdAt: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface EventInquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  message: string;
  status: string;
  createdAt: string;
}

interface JobApplication {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  resumeUrl: string;
  status: string;
  createdAt: string;
}

interface SiteSettings {
  id: number;
  announcementText: string;
  showAnnouncement: boolean;
  openingHours: string;
  generalTicketPrice: number;
  vipTicketPrice: number;
  juniorRoomPrice: number;
  twinRoomPrice: number;
  ambassadorRoomPrice: number;
  isHiringActive: boolean;
}

const Dashboard = () => {
  const { data: reservations, isLoading: isLoadingReservations } = useQuery<Reservation[]>({
    queryKey: ['/api/reservations'],
  });

  const { data: contactMessages, isLoading: isLoadingMessages } = useQuery<ContactMessage[]>({
    queryKey: ['/api/contact-messages'],
  });

  const { data: eventInquiries, isLoading: isLoadingInquiries } = useQuery<EventInquiry[]>({
    queryKey: ['/api/event-inquiries'],
  });

  const { data: jobApplications, isLoading: isLoadingJobs } = useQuery<JobApplication[]>({
    queryKey: ['/api/job-applications'],
  });

  const { data: siteSettings, isLoading: isLoadingSettings } = useQuery<SiteSettings>({
    queryKey: ['/api/site-settings'],
  });

  const isLoading = isLoadingReservations || isLoadingMessages || 
                    isLoadingInquiries || isLoadingJobs || isLoadingSettings;

  if (isLoading) {
    return (
      <div className="h-96 flex justify-center items-center">
        <LoadingSpinner size="lg" color="primary" text="Loading dashboard data..." />
      </div>
    );
  }

  // Calculate stats
  const totalReservations = reservations?.length || 0;
  const pendingReservations = reservations ? 
    reservations.filter((r: Reservation) => !r.isPaid).length : 0;
  const paidReservations = totalReservations - pendingReservations;
  const paidPercentage = totalReservations ? Math.round((paidReservations / totalReservations) * 100) : 0;
  
  const unreadMessages = contactMessages ? 
    contactMessages.filter((m: ContactMessage) => !m.isRead).length : 0;
  const newEventInquiries = eventInquiries ? 
    eventInquiries.filter((i: EventInquiry) => i.status === "new").length : 0;
  const newJobApplications = jobApplications ? 
    jobApplications.filter((a: JobApplication) => a.status === "new").length : 0;
  
  // Calculate revenue
  const totalRevenue = reservations
    ? reservations
        .filter((r: Reservation) => r.isPaid)
        .reduce((sum: number, r: Reservation) => {
          const checkIn = new Date(r.checkInDate);
          const checkOut = new Date(r.checkOutDate);
          const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
          
          const roomPrice = r.roomType === 'junior' 
            ? siteSettings?.juniorRoomPrice 
            : r.roomType === 'twin' 
              ? siteSettings?.twinRoomPrice 
              : siteSettings?.ambassadorRoomPrice;
              
          return sum + (nights * (roomPrice || 0));
        }, 0)
    : 0;

  // Generate chart data
  const revenueData = generateRevenueData(reservations || [], siteSettings);

  // Get activities data (combined from different sources)
  const activities = [
    ...(reservations 
      ? reservations.map((res: Reservation) => ({
          id: res.id,
          type: "reservation" as const,
          title: `${res.roomType.charAt(0).toUpperCase() + res.roomType.slice(1)} Room Reservation`,
          person: res.fullName,
          timestamp: new Date(res.createdAt),
          status: res.isPaid ? "success" as const : "warning" as const,
          details: `${format(new Date(res.checkInDate), 'MMM d')} - ${format(new Date(res.checkOutDate), 'MMM d')}`
        }))
      : []),
    ...(contactMessages 
      ? contactMessages.map((msg: ContactMessage) => ({
          id: msg.id,
          type: "contact" as const,
          title: "Contact Message",
          person: msg.name,
          timestamp: new Date(msg.createdAt),
          status: msg.isRead ? "success" as const : "info" as const,
          details: msg.message.substring(0, 60) + (msg.message.length > 60 ? "..." : "")
        }))
      : []),
    ...(eventInquiries 
      ? eventInquiries.map((inq: EventInquiry) => ({
          id: inq.id,
          type: "inquiry" as const,
          title: "Event Inquiry",
          person: inq.name,
          timestamp: new Date(inq.createdAt),
          status: inq.status === "new" ? "warning" as const : "success" as const,
          details: `Event Type: ${inq.eventType}, Date: ${format(new Date(inq.eventDate), 'MMM d, yyyy')}`
        }))
      : []),
    ...(jobApplications 
      ? jobApplications.map((app: JobApplication) => ({
          id: app.id,
          type: "job" as const,
          title: "Job Application",
          person: app.name,
          timestamp: new Date(app.createdAt),
          status: app.status === "new" ? "info" as const : "success" as const,
          details: `Position: ${app.position}`
        }))
      : [])
  ]
  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  .slice(0, 5);

  // Get recent reservations
  const recentReservations = reservations 
    ? [...reservations].sort((a: Reservation, b: Reservation) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 5)
    : [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
        <h2 className="text-3xl font-bold text-[#1e3a8a] mb-2 sm:mb-0">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-3 py-1.5 bg-white border-gray-200 text-sm">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </Badge>
        </div>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Reservations" 
          value={totalReservations}
          icon={CalendarCheck2}
          variant="blue"
        />
        
        <StatsCard 
          title="Pending Payments" 
          value={pendingReservations}
          icon={Clock}
          variant="yellow"
          trend={pendingReservations > 0 ? {
            value: pendingReservations > totalReservations * 0.3 ? 12 : -8,
            isPositive: pendingReservations > totalReservations * 0.3
          } : undefined}
        />
        
        <StatsCard 
          title="Total Revenue" 
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          variant="green"
          trend={{
            value: 24,
            isPositive: true
          }}
        />
        
        <StatsCard 
          title="New Inquiries" 
          value={newEventInquiries + newJobApplications + unreadMessages}
          icon={MessageSquare}
          variant="purple"
        />
      </div>
      
      {/* Analytics & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} className="h-full" />
        </div>
        
        <RecentActivity activities={activities} className="h-full" />
      </div>
      
      {/* Occupancy & Site Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OccupancyHeatmap 
          reservations={reservations || []} 
          className="lg:col-span-2"
        />
        
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Site Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <p className="text-sm font-medium text-gray-500">Announcement</p>
                  <StatusBadge variant={siteSettings?.showAnnouncement ? "success" : "warning"}>
                    {siteSettings?.showAnnouncement ? 'Active' : 'Disabled'}
                  </StatusBadge>
                </div>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  {siteSettings?.showAnnouncement 
                    ? siteSettings.announcementText || 'No announcement text' 
                    : 'Announcements disabled'}
                </p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1.5">Opening Hours</p>
                <p className="text-sm font-medium text-gray-700">{siteSettings?.openingHours || 'Not set'}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Pricing</p>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-2 bg-blue-50">
                    <div className="flex items-center">
                      <div className="mr-2 bg-blue-100 p-1 rounded-md">
                        <HotelIcon className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Junior</p>
                        <p className="text-sm font-semibold">${siteSettings?.juniorRoomPrice || 'N/A'}</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-2 bg-blue-50">
                    <div className="flex items-center">
                      <div className="mr-2 bg-blue-100 p-1 rounded-md">
                        <HotelIcon className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Twin</p>
                        <p className="text-sm font-semibold">${siteSettings?.twinRoomPrice || 'N/A'}</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-2 bg-blue-50">
                    <div className="flex items-center">
                      <div className="mr-2 bg-blue-100 p-1 rounded-md">
                        <HotelIcon className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Ambassador</p>
                        <p className="text-sm font-semibold">${siteSettings?.ambassadorRoomPrice || 'N/A'}</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-2 bg-purple-50">
                    <div className="flex items-center">
                      <div className="mr-2 bg-purple-100 p-1 rounded-md">
                        <Package className="h-4 w-4 text-purple-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">VIP Ticket</p>
                        <p className="text-sm font-semibold">${siteSettings?.vipTicketPrice || 'N/A'}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-500">Hiring Status</p>
                  <StatusBadge variant={siteSettings?.isHiringActive ? "success" : "error"}>
                    {siteSettings?.isHiringActive ? 'Active' : 'Inactive'}
                  </StatusBadge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
