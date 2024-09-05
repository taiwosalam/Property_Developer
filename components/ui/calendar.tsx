"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        // Styling for the months container
        months:
          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
        // Styling for each month
        month: "space-y-4 w-full",
        // Styling for the caption container
        caption: "flex justify-start pt-1 relative items-center",
        // Styling for the caption label
        caption_label: "text-sm font-medium",
        // Styling for the navigation container
        nav: "space-x-1 flex items-center",
        // Styling for the navigation buttons
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        // Styling for the previous navigation button
        nav_button_previous: "absolute right-9",
        // Styling for the next navigation button
        nav_button_next: "absolute right-1",
        // Styling for the table container
        table: "w-full border-collapse space-y-1",
        // Styling for the table head row
        head_row: "flex w-full justify-between",
        // Styling for the table head cell
        head_cell:
          "text-slate-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-slate-400",
        // Styling for each table row
        row: "flex w-full mt-2 w-full justify-between",
        // Styling for each table cell
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-slate-100/50 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-slate-800/50 dark:[&:has([aria-selected])]:bg-slate-800",
        // Styling for each day
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        // Styling for the end of a day range
        day_range_end: "day-range-end",
        // Styling for a selected day
        day_selected: "bg-white border shadow-md",
        // Styling for today's date
        day_today:
          "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50",
        // Styling for a day outside the current month
        day_outside:
          "day-outside text-slate-500 opacity-50 aria-selected:bg-slate-100/50 aria-selected:text-slate-500 aria-selected:opacity-30 dark:text-slate-400 dark:aria-selected:bg-slate-800/50 dark:aria-selected:text-slate-400",
        // Styling for a disabled day
        day_disabled: "text-slate-500 opacity-50 dark:text-slate-400",
        // Styling for the middle of a day range
        day_range_middle:
          "aria-selected:bg-white aria-selected:text-slate-900 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50",
        // Styling for a hidden day
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        // Custom icon component for the left navigation button
        IconLeft: ({ ...props }) => <ArrowLeft className="h-4 w-5" />,
        // Custom icon component for the right navigation button
        IconRight: ({ ...props }) => <ArrowRight className="h-4 w-5" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
