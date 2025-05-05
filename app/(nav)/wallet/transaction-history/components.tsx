"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalStore } from "@/store/general-store";
import type { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/dashboard/date-picker";

interface DateRangeSelectorProps {
  className?: string;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  className,
}) => {
  const timeRange = useGlobalStore((state) => state.timeRange);
  const selectedDateRange = useGlobalStore((state) => state.selectedDateRange);
  const setGlobalInfoStore = useGlobalStore(
    (state) => state.setGlobalInfoStore
  );

  const calculateDateRange = (days: number): DateRange => {
    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - days);
    return { from: fromDate, to: now };
  };

  React.useEffect(() => {
    if (!selectedDateRange) {
      const initialRange = calculateDateRange(30);
      setGlobalInfoStore("selectedDateRange", initialRange);
      setGlobalInfoStore("timeRange", "30d");
    }
  }, [selectedDateRange, setGlobalInfoStore]);

  const handleDateChange = (range: DateRange | undefined) => {
    setGlobalInfoStore("selectedDateRange", range);
    if (range?.from && range?.to) {
      setGlobalInfoStore("timeRange", "custom");
    }
  };

  const handleSelectChange = (value: string) => {
    setGlobalInfoStore("timeRange", value);
    if (value !== "custom") {
      const days =
        value === "90d" ? 90 : value === "30d" ? 30 : value === "7d" ? 7 : 1;
      setGlobalInfoStore("selectedDateRange", calculateDateRange(days));
    }
  };

  return (
    <div
      className={`flex items-center gap-2 bg-[#F5F5F5] dark:bg-[#020617] rounded-md ${className}`}
    >
      {timeRange === "custom" && (
        <DatePickerWithRange
          selectedRange={selectedDateRange}
          onDateChange={handleDateChange}
        />
      )}
      <Select value={timeRange} onValueChange={handleSelectChange}>
        <SelectTrigger
          className="md:w-full px-4 lg:w-[120px] rounded-lg sm:ml-auto dark:text-white dark:bg-[#020617]"
          aria-label="Select a date range"
        >
          <SelectValue placeholder="Last 30 days" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="90d" className="rounded-lg">
            Last 3 months
          </SelectItem>
          <SelectItem value="30d" className="rounded-lg">
            Last 30 days
          </SelectItem>
          <SelectItem value="7d" className="rounded-lg">
            Last 7 days
          </SelectItem>
          <SelectItem value="1d" className="rounded-lg">
            Yesterday
          </SelectItem>
          <SelectItem value="custom" className="rounded-lg">
            Custom
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
