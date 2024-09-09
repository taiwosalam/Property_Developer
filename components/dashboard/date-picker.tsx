"use client";

import * as React from "react";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({
  className,
  selectedRange,
  onDateChange,
}: React.HTMLAttributes<HTMLDivElement> & {
  selectedRange: DateRange | undefined;
  onDateChange: (range: DateRange | undefined) => void;
}) {
  // Use the selectedRange prop to set the initial state
  const [date, setDate] = React.useState<DateRange | undefined>(selectedRange);

  // Update local state and notify parent whenever the date changes
  const handleDateChange = (newRange: DateRange | undefined) => {
    setDate(newRange);
    onDateChange(newRange); // Notify parent of the change
  };

  // Sync the local state with the selectedRange prop if it changes externally
  React.useEffect(() => {
    setDate(selectedRange);
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
                  {format(date.from, "LLL dd, y")}{" "}
                  <ChevronDown className="ml-1 h-4 w-4" />-{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                <>{format(date.from, "LLL dd, y")}</>
              )
            ) : (
              <span className="ml-2">Pick a date</span>
            )}
            <ChevronDown className="ml-1 h-4 w-4" />
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
