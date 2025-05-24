"use client";

import { useState } from "react";
import {
  getYear,
  getMonth,
  subMonths,
  addMonths,
  startOfMonth,
  isSameDay,
} from "date-fns";
import {
  CalendarDay,
  CalendarWeekDays,
} from "@/components/Calendar/calendar-components";
import { Calendar } from "@/components/Calendar/data";
import { CalendarContext } from "@/components/Calendar/calendar-context";
import ComplaintsCalendarHeader from "./complaints-calendar-header";
import ComplaintsCalendarFooter from "./complaints-calendar-footer";
import { SectionSeparator } from "@/components/Section/section-components";
import { createReminder } from "@/app/(nav)/tasks/complaints/[complainId]/manage-complain/data";

const ComplaintsCalendar: React.FC<{
  header: string;
  buttonText: string;
  //   modalContent: React.ReactNode;
}> = ({ header, buttonText }) => {
  const today = new Date();
  const [activeDate, setActiveDate] = useState(today);
  const [currentDate, setCurrentDate] = useState(startOfMonth(today));
  const data = new Calendar({
    month: getMonth(currentDate),
    year: getYear(currentDate),
  });
  const { calendarDays } = data;
  const [loading, setIsLoading] = useState(false);

  const setYear = (year: number) => {
    const newDate = new Date(year, getMonth(currentDate));
    setCurrentDate(startOfMonth(newDate));
  };

  return (
    <CalendarContext.Provider
      value={{
        ...data,
        nextMonth: () => setCurrentDate((prev) => addMonths(prev, 1)),
        prevMonth: () => setCurrentDate((prev) => subMonths(prev, 1)),
        setYear,
      }}
    >
      <div
        className="rounded-lg border border-[rgba(193,194,195,0.40)] bg-white dark:bg-darkText-primary"
        style={{
          boxShadow:
            "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
        }}
      >
        <ComplaintsCalendarHeader header={header} />
        <div className="py-4 px-3 rounded-b-lg space-y-4">
          <CalendarWeekDays />
          <div className="grid grid-cols-7 gap-3">
            {calendarDays.map((day, index) => (
              <CalendarDay
                key={index}
                onClick={() => setActiveDate(day.date)}
                isActive={isSameDay(day.date, activeDate)}
                {...day}
              />
            ))}
          </div>
          <SectionSeparator
            style={{ backgroundColor: "rgba(120, 122, 126, 0.20)" }}
          />
          <ComplaintsCalendarFooter
            activeDate={activeDate}
            buttonText={buttonText}
            // modalContent={modalContent}
          />
        </div>
      </div>
    </CalendarContext.Provider>
  );
};

export default ComplaintsCalendar;
