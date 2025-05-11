import React, { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import "../../styles/day-picker.css";

interface ModernDatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  disablePastDates?: boolean;
}

export function ModernDatePicker({
  date,
  setDate,
  placeholder = "Select date",
  disablePastDates = true,
}: ModernDatePickerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const today = new Date();
  const disabledDays = disablePastDates ? { before: today } : undefined;

  // Format date for display
  const formattedDate = date ? format(date, "EEE, MMM d, yyyy") : placeholder;

  // Current month and year for display in header
  const currentMonth = date || today;
  const monthYearDisplay = format(currentMonth, "MMMM yyyy");

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-between text-left font-normal relative h-auto py-2 px-3 border border-gray-300 rounded"
        onClick={() => setIsDialogOpen(true)}
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
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[350px] p-0 rounded-lg shadow-xl">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-center">{monthYearDisplay}</h3>
          </div>
          <div className="p-2">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={handleSelect}
              disabled={disabledDays}
              showOutsideDays
              fixedWeeks
              initialFocus
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
          <div className="p-4 border-t border-gray-100 flex justify-between">
            <Button
              variant="ghost"
              className="text-[#00c6ff]"
              onClick={() => setDate(undefined)}
            >
              Clear
            </Button>
            <Button
              variant="ghost"
              className="text-[#00c6ff]"
              onClick={() => setDate(today)}
            >
              Today
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}