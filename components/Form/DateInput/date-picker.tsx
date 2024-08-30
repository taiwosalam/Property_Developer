"use client";

import * as React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@/public/icons/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  className?: string;
  textStyles?: string;
  dateValueProp?: Date;
  onDateChange?: (date: Date | undefined) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  className,
  textStyles,
  dateValueProp,
  onDateChange,
}) => {
  const [date, setDate] = React.useState<Date>();

  React.useEffect(() => {
    if (dateValueProp !== undefined) {
      setDate(dateValueProp);
    }
  }, [dateValueProp]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onDateChange) {
      onDateChange(selectedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-between",
            date ? "bg-[#FAFAFA]" : "text-muted-foreground",
            className
          )}
        >
          <p className={textStyles}>
            {date ? format(date, "MM/dd/yyyy") : <span>mm/dd/yyyy</span>}
          </p>
          <CalendarIcon/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
