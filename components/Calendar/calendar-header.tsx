import { format } from "date-fns";

// Images
import { ArrowLeft, ArrowRight } from "lucide-react";

// Imports
import { useCalendar } from "./calendar-context";
import useDarkMode from "@/hooks/useCheckDarkMode";

const CalendarHeader = () => {
  const { targetDate, nextMonth, prevMonth } = useCalendar();
  const isDarkMode = useDarkMode()

  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-black text-base dark:text-white font-medium">
        {format(targetDate, "MMMM yyyy")}
      </p>
      <div className="flex gap-3">
        <button type="button" onClick={prevMonth} className="p-1">
          <ArrowLeft size={18} color={isDarkMode ? "#fff" : "#696B70"} />
        </button>
        <button type="button" onClick={nextMonth} className="p-1">
          <ArrowRight size={18} color={isDarkMode ? "#fff" : "#696B70"} />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
