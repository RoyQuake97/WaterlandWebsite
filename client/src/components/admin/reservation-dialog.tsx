import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  CalendarIcon, 
  CalendarDaysIcon, 
  MapPinIcon, 
  Users, 
  UserCircle2, 
  Mail,
  Phone,
  Clock,
  CalendarCheck,
  MessageSquare,
  DollarSign
} from 'lucide-react';

// Define the reservation type
export interface Reservation {
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

// Form schema for editing
const reservationSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phoneNumber: z.string().min(5, 'Phone number is required'),
  email: z.string().email('Please enter a valid email').or(z.literal('')),
  roomType: z.enum(['junior', 'twin', 'ambassador']),
  checkInDate: z.string().min(1, 'Check-in date is required'),
  checkOutDate: z.string().min(1, 'Check-out date is required'),
  adults: z.coerce.number().min(1, 'At least 1 adult required').max(6, 'Maximum 6 adults'),
  children: z.coerce.number().min(0, 'Cannot be negative').max(8, 'Maximum 8 children'),
  specialRequests: z.string().optional(),
  isPaid: z.boolean().default(false),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

interface ReservationDialogProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ReservationFormValues) => void;
  isLoading?: boolean;
  siteSettings?: any;
  mode?: 'view' | 'edit';
}

export function ReservationDialog({
  reservation,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  siteSettings,
  mode = 'view',
}: ReservationDialogProps) {
  const [currentMode, setCurrentMode] = React.useState<'view' | 'edit'>(mode);

  // Setup form
  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: reservation
      ? {
          fullName: reservation.fullName,
          phoneNumber: reservation.phoneNumber,
          email: reservation.email,
          roomType: reservation.roomType as 'junior' | 'twin' | 'ambassador',
          checkInDate: reservation.checkInDate,
          checkOutDate: reservation.checkOutDate,
          adults: reservation.adults,
          children: reservation.children,
          specialRequests: reservation.specialRequests || '',
          isPaid: reservation.isPaid,
        }
      : {
          fullName: '',
          phoneNumber: '',
          email: '',
          roomType: 'junior',
          checkInDate: '',
          checkOutDate: '',
          adults: 2,
          children: 0,
          specialRequests: '',
          isPaid: false,
        },
  });

  // Calculate night count and total price
  const calculateNights = (): number => {
    if (!reservation) return 0;
    const checkIn = new Date(reservation.checkInDate);
    const checkOut = new Date(reservation.checkOutDate);
    return Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculatePrice = (): number => {
    if (!reservation || !siteSettings) return 0;
    const nights = calculateNights();
    let pricePerNight;
    
    switch (reservation.roomType) {
      case 'junior':
        pricePerNight = siteSettings.juniorRoomPrice || 250;
        break;
      case 'twin':
        pricePerNight = siteSettings.twinRoomPrice || 300;
        break;
      case 'ambassador':
        pricePerNight = siteSettings.ambassadorRoomPrice || 350;
        break;
      default:
        pricePerNight = 0;
    }
    
    return nights * pricePerNight;
  };

  const nights = calculateNights();
  const totalPrice = calculatePrice();

  // Handle mode switching
  const handleModeChange = (newMode: 'view' | 'edit') => {
    if (newMode === 'edit') {
      form.reset(reservation ? {
        fullName: reservation.fullName,
        phoneNumber: reservation.phoneNumber,
        email: reservation.email,
        roomType: reservation.roomType as 'junior' | 'twin' | 'ambassador',
        checkInDate: reservation.checkInDate,
        checkOutDate: reservation.checkOutDate,
        adults: reservation.adults,
        children: reservation.children,
        specialRequests: reservation.specialRequests || '',
        isPaid: reservation.isPaid,
      } : undefined);
    }
    setCurrentMode(newMode);
  };

  // Handle form submission
  const onSubmit = (data: ReservationFormValues) => {
    onSave(data);
  };

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Reset form when reservation changes
  React.useEffect(() => {
    if (reservation) {
      form.reset({
        fullName: reservation.fullName,
        phoneNumber: reservation.phoneNumber,
        email: reservation.email,
        roomType: reservation.roomType as 'junior' | 'twin' | 'ambassador',
        checkInDate: reservation.checkInDate,
        checkOutDate: reservation.checkOutDate,
        adults: reservation.adults,
        children: reservation.children,
        specialRequests: reservation.specialRequests || '',
        isPaid: reservation.isPaid,
      });
    }
  }, [reservation, form]);

  if (!reservation && currentMode !== 'edit') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="py-10 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : currentMode === 'view' && reservation ? (
          <>
            <DialogHeader>
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="text-2xl text-[#1e3a8a]">Reservation Details</DialogTitle>
                  <DialogDescription>
                    Reservation #{reservation.id} • Created {format(new Date(reservation.createdAt), 'MMM d, yyyy')}
                  </DialogDescription>
                </div>
                <StatusBadge variant={reservation.isPaid ? "success" : "warning"}>
                  {reservation.isPaid ? 'Paid' : 'Pending'}
                </StatusBadge>
              </div>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 bg-[#1e3a8a] text-white text-lg">
                    <span>{getInitials(reservation.fullName)}</span>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-lg">{reservation.fullName}</h3>
                    <div className="text-sm text-gray-500">Guest</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{reservation.email || 'No email provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{reservation.phoneNumber}</span>
                  </div>
                </div>
              </div>

              {/* Reservation Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Reservation Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-md mt-0.5">
                      <CalendarDaysIcon className="h-4 w-4 text-blue-700" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Stay Period</div>
                      <div className="font-medium text-sm">
                        {format(new Date(reservation.checkInDate), 'MMM d, yyyy')} - {format(new Date(reservation.checkOutDate), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{nights} {nights === 1 ? 'night' : 'nights'}</div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-md mt-0.5">
                      <DollarSign className="h-4 w-4 text-green-700" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Total Amount</div>
                      <div className="font-medium text-sm">${totalPrice.toLocaleString()}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {reservation.isPaid ? 'Paid in full' : 'Payment pending'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-purple-50 p-3 rounded flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-md mt-0.5">
                      <Users className="h-4 w-4 text-purple-700" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Guests</div>
                      <div className="font-medium text-sm">
                        {reservation.adults} {reservation.adults === 1 ? 'Adult' : 'Adults'}
                        {reservation.children > 0 && `, ${reservation.children} ${reservation.children === 1 ? 'Child' : 'Children'}`}
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded flex items-start gap-3">
                    <div className="bg-yellow-100 p-2 rounded-md mt-0.5">
                      <MapPinIcon className="h-4 w-4 text-yellow-700" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Room Type</div>
                      <div className="font-medium text-sm capitalize">
                        {reservation.roomType} Room
                      </div>
                    </div>
                  </div>
                </div>

                {reservation.specialRequests && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Special Requests</h4>
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-800">
                      {reservation.specialRequests}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="flex justify-between sm:justify-between gap-2">
              <Button variant="outline" onClick={() => handleModeChange('edit')}>
                Edit Reservation
              </Button>
              <Button onClick={onClose}>Close</Button>
            </DialogFooter>
          </>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>{reservation ? 'Edit Reservation' : 'Add New Reservation'}</DialogTitle>
                <DialogDescription>
                  {reservation 
                    ? `Update details for reservation #${reservation.id}` 
                    : 'Enter details for the new reservation'}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guest Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
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
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email address (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="checkInDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check-in Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="checkOutDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check-out Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="roomType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select room type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="junior">Junior Room</SelectItem>
                            <SelectItem value="twin">Twin Room</SelectItem>
                            <SelectItem value="ambassador">Ambassador Room</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="adults"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adults</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={6} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="children"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Children</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} max={8} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any special requests from the guest..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPaid"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Payment Status</FormLabel>
                        <FormDescription>
                          Mark this reservation as paid if payment has been received
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
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                {reservation && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleModeChange('view')}
                    className="mr-auto"
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner size="sm" color="white" showText={false} /> : null}
                  {reservation ? 'Save Changes' : 'Create Reservation'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}