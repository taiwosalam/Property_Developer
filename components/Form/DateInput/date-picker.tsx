"use client";

import * as React from "react";
import { format } from "date-fns";
import SVG from "@/components/SVG/svg";
import { cn } from "@/lib/utils";
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
}

const DatePicker: React.FC<DatePickerProps> = ({ className, textStyles }) => {
  const [date, setDate] = React.useState<Date>();

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
          <SVG type="calendar" className="mr-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
