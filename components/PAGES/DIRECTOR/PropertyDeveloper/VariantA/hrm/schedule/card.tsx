import { useState, useEffect } from "react";
import Select from "@/components/Form/Select/select"; // Adjust path
import { SelectProps } from "@/components/Form/Select/types";
import { SelectOptionObject } from "@/components/Form/Select/types";
import { addDays, startOfMonth, addMonths } from "date-fns";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Type for view options
export type ViewOption = "week" | "month";

// Type for date state
export interface DateState {
  view: ViewOption;
  date: Date;
  fromDate: Date;
}

interface DateViewSelectorProps {
  state: DateState;
  setState: React.Dispatch<React.SetStateAction<DateState>>;
}

const DateViewSelector: React.FC<DateViewSelectorProps> = ({
  state,
  setState,
}) => {
  const viewOptions: SelectOptionObject[] = [
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ];

  // keep fromDate in sync
  useEffect(() => {
    if (state.view === "week") {
      setState((prev) => ({ ...prev, fromDate: prev.date }));
    }
  }, [state.view, state.date, setState]);

  const handleViewChange = (value: string): void => {
    setState((prev) => ({ ...prev, view: value as ViewOption }));
  };

  const handlePrev = (): void => {
    setState((prev) => ({
      ...prev,
      date:
        prev.view === "week"
          ? addDays(prev.date, -7)
          : addMonths(prev.date, -1),
    }));
  };

  const handleNext = (): void => {
    setState((prev) => ({
      ...prev,
      date:
        prev.view === "week" ? addDays(prev.date, 7) : addMonths(prev.date, 1),
    }));
  };

  const formatDate = (d: Date): string =>
    d.toLocaleDateString("en-US", { dateStyle: "medium" });

  return (
    <div className="flex items-center gap-4">
      <Select
        id="view-select"
        className="border-[2px] border-brand-9 rounded-lg w-[150px]"
        options={viewOptions}
        value={viewOptions.find((o) => o.value === state.view) || ""}
        onChange={handleViewChange}
        placeholder="Select view"
      />
      <div className="flex items-center gap-2">
        {state.view === "week" ? (
          <span>
            {formatDate(state.fromDate)} -{" "}
            {formatDate(addDays(state.fromDate, 6))}
          </span>
        ) : (
          <span>{formatDate(startOfMonth(state.date))}</span>
        )}
        <button onClick={handlePrev}>
          <ArrowLeft className="text-gray-400 size-6" />
        </button>
        <button onClick={handleNext}>
          <ArrowRight className="text-gray-400 size-6" />
        </button>
      </div>
    </div>
  );
};

export default DateViewSelector;

import { useCallback } from "react";
// import { format } from "date-fns";
import Image from "next/image";
import {
  DayCellProps,
  Shift,
  ShiftBadgeProps,
  StaffRowProps,
  WeekViewProps,
} from "./data";
import Picture from "@/components/Picture/picture";
import { empty } from "@/app/config";

const format = (date: Date, formatStr: string): string => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  switch (formatStr) {
    case "yyyy-MM-dd":
      return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    case "EEE":
      return days[date.getDay()];
    case "d":
      return date.getDate().toString();
    case "EEE dd":
      return `${days[date.getDay()]} ${date
        .getDate()
        .toString()
        .padStart(2, "0")}`;
    default:
      return date.toString();
  }
};

// Types

const ShiftBadge: React.FC<ShiftBadgeProps> = ({ shift, onEdit }) => {
  const { type, slot, start, end } = shift;

  // Color mapping (main + lighter background)
  const getShiftColors = (shiftType: string) => {
    const lowerType = shiftType.toLowerCase();
    if (lowerType.includes("night off") || lowerType === "night off") {
      return {
        text: "text-purple-600",
        bg: "bg-purple-100",
        border: "border-purple-600",
      };
    } else if (lowerType.includes("morning")) {
      return {
        text: "text-cyan-600",
        bg: "bg-cyan-100",
        border: "border-cyan-600",
      };
    } else if (lowerType.includes("afternoon")) {
      return {
        text: "text-orange-600",
        bg: "bg-orange-100",
        border: "border-orange-600",
      };
    } else if (lowerType.includes("evening") || lowerType.includes("night")) {
      return {
        text: "text-purple-600",
        bg: "bg-purple-100",
        border: "border-purple-600",
      };
    } else {
      return {
        text: "text-gray-600",
        bg: "bg-gray-100",
        border: "border-gray-600",
      };
    }
  };

  const { text, bg, border } = getShiftColors(type);

  const displayTime = start && end ? `${start} - ${end}` : "06:00 AM - 12:00PM";
  const displayText = type.replace(" Shift", "");
  return (
    <div
      className={`px-2 py-1 text-xs font-medium cursor-pointer hover:opacity-90 flex flex-col justify-center ${bg} ${text} border-l-4 ${border}`}
      onClick={() => onEdit(shift)}
    >
      <div className="text-left">
        <div className="font-bold text-xs leading-tight">{displayText}</div>
        <div className="text-xs whitespace-nowrap mt-0.5 opacity-90 leading-tight">
          {displayTime}
        </div>
      </div>
    </div>
  );
};

const DayCell: React.FC<DayCellProps> = ({
  date,
  shifts,
  onEditShift,
  staffId,
}) => {
  const handleEdit = useCallback(
    (shift: Shift) => {
      onEditShift(staffId, format(date, "yyyy-MM-dd"), shift);
    },
    [date, onEditShift, staffId]
  );

  const handleCellClick = () => {
    // Placeholder for adding new shift functionality
    console.log(
      `Add new shift for ${staffId} on ${format(date, "yyyy-MM-dd")}`
    );
  };

  return (
    <div className="w-40 flex-shrink-0 border-r border-gray-100 last:border-r-0 flex flex-col h-24">
      {/* Clickable empty area at top */}
      <div
        className="flex-1 cursor-pointer hover:bg-gray-50 px-2 py-1"
        onClick={handleCellClick}
      >
        {/* Empty clickable space */}
      </div>
      {/* Scrollable shifts container */}
      <div className="px-2 pb-2 no-scrollbar max-h-16 overflow-y-auto">
        <div className="space-y-1">
          {shifts.map((shift, index) => (
            <ShiftBadge key={index} shift={shift} onEdit={handleEdit} />
          ))}
        </div>
      </div>
    </div>
  );
};

const StaffRow: React.FC<StaffRowProps> = ({
  staff,
  fromDate,
  onEditShift,
}) => {
  const days = Array.from({ length: 7 }, (_, i) => addDays(fromDate, i));

  return (
    <div className="flex items-stretch border-b border-gray-100 bg-white hover:bg-gray-50 h-24">
      {/* Spacer for sticky staff column */}
      <div className="w-80 flex-shrink-0"></div>

      {/* Schedule Columns */}
      <div className="flex">
        {days.map((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const shifts = staff.schedules[dateStr] || [];
          return (
            <DayCell
              key={dateStr}
              date={date}
              shifts={shifts}
              onEditShift={onEditShift}
              staffId={staff.id}
            />
          );
        })}
      </div>
    </div>
  );
};

export const WeekView: React.FC<WeekViewProps> = ({
  staffList,
  fromDate,
  onEditShift,
}) => {
  const days = Array.from({ length: 7 }, (_, i) => addDays(fromDate, i));
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
      {/* Sticky Staff Header */}
      <div className="absolute left-0 top-0 z-20 w-80 bg-brand-9 border-r border-blue-400">
        <div className="px-6 py-7">
          <div className="font-semibold text-white text-base">Staff Name</div>
        </div>
      </div>

      {/* Main scrollable container */}
      <div className="overflow-x-auto">
        <div className="min-w-fit">
          {/* Header */}
          <div className="flex bg-brand-9 text-white">
            {/* Spacer for sticky staff column */}
            <div className="w-80 flex-shrink-0"></div>
            {/* Day Headers */}
            <div className="flex">
              {days.map((date) => (
                <div
                  key={format(date, "yyyy-MM-dd")}
                  className="w-40 flex-shrink-0 px-2 py-4 text-center border-r border-blue-400 last:border-r-0"
                >
                  <div className="font-bold text-lg">{format(date, "d")}</div>
                  <div className="text-sm opacity-90">
                    {format(date, "EEE")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Staff Rows */}
          <div className=" overflow-y-auto">
            <div className="divide-y divide-gray-100">
              {staffList.map((staff) => (
                <StaffRow
                  key={staff.id}
                  staff={staff}
                  fromDate={fromDate}
                  onEditShift={onEditShift}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Staff Column */}
      <div className="absolute left-0 top-0 z-10 w-80 bg-white border-r border-gray-100">
        {/* Spacer for header */}
        <div className="h-16"></div>

        {/* Staff Info Column */}
        <div className=" overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {staffList.map((staff) => (
              <div
                key={staff.id}
                className="h-24 px-6 py-4 flex items-center gap-4 bg-white border-b border-gray-100"
              >
                <Picture
                  src={empty}
                  alt={staff.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 text-sm truncate">
                    {staff.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {staff.position}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
