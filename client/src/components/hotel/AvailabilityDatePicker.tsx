import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import "../../styles/day-picker.css";

interface AvailabilityDatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  disablePastDates?: boolean;
  readOnly?: boolean;
  minDate?: Date;   // Optional minimum date (for checkout - can't be before checkin)
  otherDate?: Date; // Optional reference date (for checkout - to highlight the range)
  isCheckout?: boolean; // Whether this is a checkout date picker
}

export function AvailabilityDatePicker({
  date,
  setDate,
  placeholder = "Select date",
  disablePastDates = true,
  readOnly = false,
  minDate,
  otherDate,
  isCheckout = false
}: AvailabilityDatePickerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const today = new Date();
  
  // Format date for display
  const formattedDate = date ? format(date, "EEE, MMM d, yyyy") : placeholder;

  // Handle disabled days - past days
  const [disabledDays, setDisabledDays] = useState<Date[]>([]);
  
  // Update disabled days whenever dialog opens or props change
  useEffect(() => {
    let daysToDisable: Date[] = [];
    
    // Add past days if needed
    if (disablePastDates) {
      const pastDays = Array.from({ length: 60 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i - 1);
        return d;
      });
      daysToDisable = [...daysToDisable, ...pastDays];
    }
    
    // For checkout date picker, add dates before check-in
    if (isCheckout && minDate) {
      const daysBeforeCheckin = Array.from({ length: 60 }, (_, i) => {
        const d = new Date(minDate);
        d.setDate(d.getDate() - i - 1);
        return d;
      });
      daysToDisable = [...daysToDisable, ...daysBeforeCheckin];
    }
    
    setDisabledDays(daysToDisable);
  }, [disablePastDates, minDate, isCheckout, isDialogOpen]);

  return (
    <>
      <Button
        variant="outline"
        className={`w-full justify-between text-left font-normal relative h-auto py-2 px-3 border border-gray-300 rounded ${readOnly ? 'cursor-default opacity-80' : ''}`}
        onClick={() => !readOnly && setIsDialogOpen(true)}
      >
        <div className="flex items-center">
          <svg 
            className="mr-2 text-[#00c6ff]" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M15.6949 13.7H15.7039M15.6949 16.7H15.7039M11.9949 13.7H12.0049M11.9949 16.7H12.0049M8.29492 13.7H8.30492M8.29492 16.7H8.30492" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className={date ? "text-black" : "text-gray-500"}>
            {formattedDate}
          </span>
        </div>
        {!readOnly && (
          <span className="ml-auto">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.5 5.25L7 8.75L10.5 5.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[350px] p-4 rounded-lg shadow-xl">
          <DialogTitle className="text-xl font-semibold text-center mb-2">
            Select a Date
          </DialogTitle>
          
          <div className="p-2">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  setDate(selectedDate);
                  setIsDialogOpen(false);
                }
              }}
              disabled={disabledDays}
              showOutsideDays
              fixedWeeks
              defaultMonth={date || new Date()} 
              fromMonth={new Date()} // Can't select dates before current month
              toMonth={new Date(new Date().setMonth(new Date().getMonth() + 11))} // Allow booking up to 12 months ahead
              className="m-0"
              modifiersClassNames={{
                selected: "bg-[#00c6ff] text-white rounded-full",
                today: "text-[#00c6ff] font-bold border border-[#00c6ff] rounded-full",
              }}
              styles={{
                head_cell: { 
                  color: '#6b7280', 
                  fontSize: '0.875rem',
                  padding: '0.5rem 0',
                  textTransform: 'uppercase'
                },
                caption: { position: 'relative', padding: '0.5rem 0' },
                caption_label: { fontWeight: 'bold', fontSize: '1.1rem' },
                nav: { display: 'flex', justifyContent: 'center', gap: '1rem' },
                nav_button: { 
                  padding: '0.5rem', 
                  background: '#f3f4f6', 
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                },
                table: { width: '100%' },
                tbody: { fontWeight: 'normal' },
                day: { 
                  margin: '4px',
                  width: '38px',
                  height: '38px',
                  fontSize: '0.95rem',
                  fontWeight: 'normal'
                }
              }}
            />
          </div>
          
          <DialogFooter className="flex justify-between w-full gap-2 mt-2">
            <Button
              variant="ghost"
              className="text-[#00c6ff]"
              onClick={() => {
                setDate(undefined);
                setIsDialogOpen(false);
              }}
            >
              Clear
            </Button>
            
            <Button
              variant="outline"
              className="text-gray-600"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}