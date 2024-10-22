"use client";

import * as React from "react";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const calculateDefaultDateRange = () => {
  const now = new Date();
  const fromDate = new Date();
  fromDate.setDate(now.getDate() - 30);
  return { from: fromDate, to: now };
};

export function DatePickerWithRange({
  className,
  selectedRange,
  onDateChange,
}: React.HTMLAttributes<HTMLDivElement> & {
  selectedRange: DateRange | undefined;
  onDateChange: (range: DateRange | undefined) => void;
}) {
  // Initialize with default 30-day range if no selectedRange is provided
  const [date, setDate] = React.useState<DateRange | undefined>(
    selectedRange || calculateDefaultDateRange()
  );

  // Update local state and notify parent whenever the date changes
  const handleDateChange = (newRange: DateRange | undefined) => {
    setDate(newRange);
    onDateChange(newRange);
  };

  // Sync with external changes while preserving default behavior
  React.useEffect(() => {
    setDate(selectedRange || calculateDefaultDateRange());
  }, [selectedRange]);

  return (
    <div className={cn(className)}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            id="date"
            className={cn(
              "inline-flex items-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 px-3 py-2 w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
