import React from "react";
import { format, setMonth } from "date-fns";

// Images
import { ArrowLeft, ArrowRight } from "lucide-react";

// Imports
import { useCalendar } from "./calendar-context";

const CalendarHeader = () => {
  const { year, month, nextMonth, prevMonth } = useCalendar();

  return (
    <div className="flex items-center justify-between">
      <p className="text-black text-base font-medium">
        {format(setMonth(new Date(year, 0), month), "MMMM")} {year}
      </p>
      <div className="flex gap-3">
        <button onClick={prevMonth} className="p-1">
          <ArrowLeft size={18} color="#696B70" />
        </button>
        <button onClick={nextMonth} className="p-1">
          <ArrowRight size={18} color="#696B70" />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
