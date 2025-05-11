import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays, formatDistance } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { EnhancedTable } from "@/components/admin/enhanced-table";
import { ReservationDialog, Reservation as ReservationType } from "@/components/admin/reservation-dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { 
  CalendarDays, 
  Plus, 
  RefreshCcw, 
  Download, 
  Mail, 
  Eye, 
  Edit, 
  Trash, 
  Users, 
  MapPin,
  Filter,
  Star
} from "lucide-react";
import 'react-big-calendar/lib/css/react-big-calendar.css';

const manualReservationSchema = z.object({
  fullName: z.string().optional().or(z.literal("")),
  phoneNumber: z.string().optional().or(z.literal("")),
  email: z.string().email("If provided, email must be valid").optional().or(z.literal("")),
  roomType: z.string().optional().or(z.literal("")),
  checkInDate: z.string().optional().or(z.literal("")),
  checkOutDate: z.string().optional().or(z.literal("")),
  adults: z.string().optional().or(z.literal("")),
  children: z.string().optional().or(z.literal("")),
  specialRequests: z.string().optional().or(z.literal("")),
  isPaid: z.boolean().default(false),
});

type ManualReservationFormValues = z.infer<typeof manualReservationSchema>;

const Reservations = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationType | null>(null);
  const [editMode, setEditMode] = useState<'view' | 'edit'>('view');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reservations, isLoading } = useQuery<ReservationType[]>({
    queryKey: ['/api/reservations'],
  });

  const { data: siteSettings } = useQuery({
    queryKey: ['/api/site-settings'],
  });

  // Handler for viewing a reservation
  const handleViewReservation = (reservation: ReservationType) => {
    setSelectedReservation(reservation);
    setEditMode('view');
    setIsViewModalOpen(true);
  };

  // Handler for creating a new reservation
  const handleOpenCreateForm = () => {
    setSelectedReservation(null);
    setEditMode('edit');
    setIsCreateModalOpen(true);
  };

  // Handler for saving a reservation (create or update)
  const handleSaveReservation = async (data: any) => {
    try {
      // Format the data properly
      const reservationData = {
        fullName: data.fullName || "Guest",
        phoneNumber: data.phoneNumber || "Not provided",
        email: data.email || "",
        roomType: data.roomType || "junior",
        checkInDate: data.checkInDate || new Date().toISOString().split('T')[0],
        checkOutDate: data.checkOutDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
        adults: typeof data.adults === 'string' ? parseInt(data.adults) || 1 : data.adults || 1,
        children: typeof data.children === 'string' ? parseInt(data.children) || 0 : data.children || 0,
        specialRequests: data.specialRequests || "",
        isPaid: data.isPaid || false
      };

      if (selectedReservation) {
        // Update existing reservation
        await apiRequest('PATCH', `/api/reservations/${selectedReservation.id}`, reservationData);
        toast({
          title: "Reservation Updated",
          description: "The reservation has been successfully updated.",
        });
      } else {
        // Create new reservation
        await apiRequest('POST', '/api/reservations', reservationData);
        toast({
          title: "Reservation Created",
          description: "The reservation has been successfully added to the system.",
        });
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/reservations'] });
      
      // Close dialogs
      setIsViewModalOpen(false);
      setIsCreateModalOpen(false);
    } catch (error) {
      toast({
        title: selectedReservation ? "Failed to Update Reservation" : "Failed to Create Reservation",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Handler for deleting reservations
  const handleDeleteReservations = async (selectedRows: ReservationType[]) => {
    if (!window.confirm(`Are you sure you want to delete ${selectedRows.length} reservation(s)? This action cannot be undone.`)) {
      return;
    }
    
    try {
      // Delete each reservation
      for (const reservation of selectedRows) {
        await apiRequest('DELETE', `/api/reservations/${reservation.id}`, {});
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/reservations'] });
      
      toast({
        title: "Reservations Deleted",
        description: `${selectedRows.length} reservation(s) have been successfully removed.`,
      });
    } catch (error) {
      toast({
        title: "Failed to Delete Reservations",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Handler for toggling paid status on multiple reservations
  const handleTogglePaidStatus = async (selectedRows: ReservationType[], setToPaid: boolean) => {
    try {
      // Update each reservation
      for (const reservation of selectedRows) {
        await apiRequest('PATCH', `/api/reservations/${reservation.id}`, {
          isPaid: setToPaid
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/reservations'] });
      
      toast({
        title: "Status Updated",
        description: `${selectedRows.length} reservation(s) marked as ${setToPaid ? 'paid' : 'unpaid'}.`,
      });
    } catch (error) {
      toast({
        title: "Failed to Update Status",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Date localizer for big calendar
  const locales = {
    'en-US': {format, parse, startOfWeek, getDay}
  };
  
  // Setup localizer for the calendar
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date()),
    getDay,
    locales,
  });
  
  // Format reservations for calendar events
  const calendarEvents = reservations ? reservations.map(reservation => {
    const startDate = new Date(reservation.checkInDate);
    const endDate = new Date(reservation.checkOutDate);
    
    return {
      id: reservation.id,
      title: `${reservation.fullName} - ${reservation.roomType.charAt(0).toUpperCase() + reservation.roomType.slice(1)}`,
      start: startDate,
      end: endDate,
      resource: reservation,
      allDay: true,
    };
  }) : [];
  
  // Handle event click in calendar  
  const handleEventSelect = (event: any) => {
    // For calendar events, we use the view mode
    setSelectedReservation(event.resource);
    setEditMode('view');
    setIsViewModalOpen(true);
  };
  
  // Function to get avatar initials
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to get room type color
  const getRoomTypeColor = (roomType: string) => {
    switch (roomType.toLowerCase()) {
      case 'junior': return '#34D399';
      case 'twin': return '#60A5FA';
      case 'ambassador': return '#F59E0B';
      default: return '#9CA3AF';
    }
  };

  // Setup table columns
  const tableColumns = [
    {
      id: 'guest',
      header: 'Guest',
      accessorKey: 'fullName',
      cell: ({ row }: { row: ReservationType }) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 bg-[#1e3a8a] text-white">
            <span className="text-xs">
              {row.fullName.split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </span>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">{row.fullName}</div>
            <div className="text-sm text-gray-500">{row.email || 'No email'}</div>
          </div>
        </div>
      )
    },
    {
      id: 'room',
      header: 'Room Type',
      accessorKey: 'roomType',
      cell: ({ row }: { row: ReservationType }) => {
        const roomColors = {
          junior: { bg: 'bg-blue-100', text: 'text-blue-800' },
          twin: { bg: 'bg-purple-100', text: 'text-purple-800' },
          ambassador: { bg: 'bg-amber-100', text: 'text-amber-800' }
        };
        
        const roomType = row.roomType as keyof typeof roomColors;
        const colors = roomColors[roomType] || { bg: 'bg-gray-100', text: 'text-gray-800' };
        
        return (
          <Badge variant="outline" className={`${colors.bg} ${colors.text} border-0 capitalize`}>
            {row.roomType}
          </Badge>
        );
      }
    },
    {
      id: 'dates',
      header: 'Stay Period',
      accessorKey: (row: ReservationType) => {
        const checkIn = new Date(row.checkInDate);
        const checkOut = new Date(row.checkOutDate);
        return `${format(checkIn, 'MMM d')} - ${format(checkOut, 'MMM d')}`;
      },
      cell: ({ row }: { row: ReservationType }) => {
        const checkIn = new Date(row.checkInDate);
        const checkOut = new Date(row.checkOutDate);
        const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        
        return (
          <div>
            <div className="font-medium">
              {format(checkIn, 'MMM d')} - {format(checkOut, 'MMM d')}
            </div>
            <div className="text-xs text-gray-500">
              {nights} {nights === 1 ? 'night' : 'nights'}
            </div>
          </div>
        );
      }
    },
    {
      id: 'guests',
      header: 'Guests',
      accessorKey: (row: ReservationType) => `${row.adults + row.children} guests`,
      cell: ({ row }: { row: ReservationType }) => (
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2 text-gray-400" />
          <span>
            {row.adults} {row.adults === 1 ? 'adult' : 'adults'}
            {row.children > 0 && `, ${row.children} ${row.children === 1 ? 'child' : 'children'}`}
          </span>
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'isPaid',
      cell: ({ row }: { row: ReservationType }) => (
        <StatusBadge variant={row.isPaid ? "success" : "warning"}>
          {row.isPaid ? 'Paid' : 'Pending'}
        </StatusBadge>
      )
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessorKey: (row: ReservationType) => new Date(row.createdAt).getTime(),
      cell: ({ row }: { row: ReservationType }) => (
        <div className="text-sm text-gray-500">
          {formatDistance(new Date(row.createdAt), new Date(), { addSuffix: true })}
        </div>
      )
    },
  ];

  // Actions for the table
  const tableActions = [
    {
      label: "Add New",
      onClick: handleOpenCreateForm,
      icon: <Plus className="h-4 w-4 mr-1" />
    },
    {
      label: "Mark as Paid",
      onClick: (rows: ReservationType[]) => handleTogglePaidStatus(rows, true),
      icon: <Star className="h-4 w-4 mr-1" />
    },
    {
      label: "Mark as Unpaid",
      onClick: (rows: ReservationType[]) => handleTogglePaidStatus(rows, false),
      icon: <Filter className="h-4 w-4 mr-1" />
    },
    {
      label: "Delete",
      onClick: handleDeleteReservations,
      icon: <Trash className="h-4 w-4 mr-1" />
    }
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-[#1e3a8a]">Reservations</h2>
        <Button 
          onClick={handleOpenCreateForm}
          className="bg-[#1e3a8a] hover:bg-[#132a63] text-white font-medium"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Reservation
        </Button>
      </div>

      <Tabs defaultValue="table" className="mb-6">
        <TabsList className="mb-4 p-1 bg-[#F9FAFB] rounded-lg border">
          <TabsTrigger value="table" className="px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-[#1e3a8a] data-[state=active]:shadow-sm">
            <Eye className="h-4 w-4 mr-2" /> Table View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-[#1e3a8a] data-[state=active]:shadow-sm">
            <CalendarDays className="h-4 w-4 mr-2" /> Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <EnhancedTable 
            data={reservations || []}
            columns={tableColumns}
            actions={tableActions}
            isLoading={isLoading}
            searchable={true}
            searchPlaceholder="Search by name, email, or phone..."
            onRowClick={handleViewReservation}
            pagination={true}
            pageSize={10}
            emptyStateMessage="No reservations found. Create your first reservation using the 'Add New' button above."
            className="border-0 shadow-sm"
          />
        </TabsContent>

        <TabsContent value="calendar">
          <Card className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <LoadingSpinner size="lg" />
                <p className="mt-2 text-gray-600">Loading calendar...</p>
              </div>
            ) : (
              <div style={{ height: 700 }}>
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  views={['month', 'week', 'day']}
                  defaultView="month"
                  onSelectEvent={handleEventSelect}
                  tooltipAccessor={(event: any) => `
                    ${event.title}
                    Check-in: ${format(event.start, 'MMM dd, yyyy')}
                    Check-out: ${format(event.end, 'MMM dd, yyyy')}
                    Status: ${event.resource.isPaid ? 'Paid' : 'Pending'}
                  `}
                  eventPropGetter={(event: any) => ({
                    style: {
                      backgroundColor: getRoomTypeColor(event.resource.roomType),
                      border: 'none',
                      borderRadius: '4px',
                      opacity: event.resource.isPaid ? 1 : 0.7,
                    },
                  })}
                  dayPropGetter={(date) => ({
                    className: 'rbc-day-slot',
                    style: {
                      backgroundColor: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                        ? '#E5F6FF'
                        : undefined,
                    },
                  })}
                />
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Reservation Modal */}
      <ReservationDialog
        reservation={null}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveReservation}
        isLoading={false}
        siteSettings={siteSettings}
        mode="edit"
      />

      {/* View/Edit Reservation Dialog */}
      <ReservationDialog
        reservation={selectedReservation}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onSave={handleSaveReservation}
        isLoading={false}
        siteSettings={siteSettings}
        mode={editMode}
      />
    </div>
  );
};

export default Reservations;