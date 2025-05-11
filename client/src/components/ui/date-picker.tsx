import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import "../../styles/day-picker.css";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  disablePastDates?: boolean;
}

export function DatePicker({
  date,
  setDate,
  disabled,
  placeholder = "Select date",
  className,
  disablePastDates = true,
}: DatePickerProps) {
  const today = new Date();
  const disabledDays = disablePastDates ? { before: today } : undefined;

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setDate(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal relative",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4 text-[#00c6ff]" />
            {date ? format(date, "MMMM d, yyyy") : placeholder}
          </div>
          {date && (
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-10 h-full px-2 py-0 hover:bg-transparent"
              onClick={handleReset}
            >
              <span className="sr-only">Clear date</span>
              <span aria-hidden="true" className="text-sm text-gray-500">×</span>
            </Button>
          )}
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
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-lg">Select Date</h3>
        </div>
        <DayPicker
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disabledDays}
          className="p-3"
          classNames={{
            months: "flex flex-col",
            month: "space-y-4",
            caption: "flex justify-between pt-1 relative items-center",
            caption_label: "text-lg font-bold text-gray-900",
            nav: "space-x-1 flex items-center",
            nav_button: "h-8 w-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse",
            head_row: "flex w-full",
            head_cell: "text-muted-foreground rounded-md w-9 font-medium text-center text-xs m-0.5",
            row: "flex w-full mt-2",
            cell: "relative p-0 text-center text-sm rounded-md h-9 w-9 m-0.5 focus-within:relative",
            day: "h-9 w-9 p-0 font-medium text-sm aria-selected:opacity-100 rounded-full hover:bg-blue-50 focus:bg-blue-50 focus:outline-none",
            day_selected: "bg-[#00c6ff] !text-white hover:bg-[#00c6ff] hover:text-white focus:bg-[#00c6ff] focus:text-white",
            day_today: "bg-gray-50 text-[#00c6ff] font-bold",
            day_disabled: "text-gray-300 hover:bg-transparent",
            day_range_middle: "aria-selected:bg-blue-50 aria-selected:text-gray-900",
            day_hidden: "invisible",
            caption_dropdowns: "flex gap-1",
          }}
          components={{
            IconLeft: () => (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            IconRight: () => (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
          }}
          footer={
            <div className="p-3 border-t border-gray-100 flex justify-between">
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
          }
        />
      </PopoverContent>
    </Popover>
  );
}