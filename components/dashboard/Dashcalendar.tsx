"use client";

import { useEffect, useState } from "react";
import {
  getYear,
  getMonth,
  subMonths,
  addMonths,
  startOfMonth,
  format,
  isSameDay,
  setMonth,
} from "date-fns";
import { CalendarDay, CalendarWeekDays } from "../Calendar/calendar-components";
import { Calendar } from "../Calendar/data";
import { calendar_events } from "../Calendar/events";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CalendarEventsApiResponse } from "@/app/(nav)/tasks/calendars/types";
import useFetch from "@/hooks/useFetch";
import { transformCalendarEvents } from "@/app/(nav)/tasks/calendars/data";
import { CalendarEventProps } from "../Calendar/types";

const DashboarddCalendar = () => {
  const [activeDate, setActiveDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventProps[]>([]);

  const { data: calendarEventApiResponse, loading, error } = useFetch<CalendarEventsApiResponse>("/company/calender");

   useEffect(() => {
      if(calendarEventApiResponse){
        const events = transformCalendarEvents(calendarEventApiResponse);
        setCalendarEvents(events);
      }
  
    }, [calendarEventApiResponse]);

  // Initialize the Calendar instance with month and year
  const data = new Calendar({
    month: getMonth(currentDate),
    year: getYear(currentDate),
    events: calendarEvents,
  });

  const { calendarDays, month, year } = data;

  return (
    <div
      className="border border-[#CCCCCCB2] dark:border-[#3C3D37] border-opacity-70 p-[18px] rounded-[8px] bg-white dark:bg-darkText-primary space-y-2"
      style={{
        boxShadow: "0px 2px 4px 0px #0D172114, 0px 1px 2px 0px #151E2B14",
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-black dark:text-white text-base font-medium">
            {format(setMonth(new Date(year, 0), month), "MMMM")} {year}
          </p>
        </div>
        <div className="text-[#696B70] dark:text-darkText-1 flex items-center gap-3">
          <ArrowLeft
            size={18}
            className="cursor-pointer"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          />
          <ArrowRight
            size={18}
            className="cursor-pointer"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          />
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#CCCCCCB2] dark:bg-darkText-1 bg-opacity-70" />
      <div className="custom-flex-col gap-4">
        <CalendarWeekDays type="short" />
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
      </div>
    </div>
  );
};

export default DashboarddCalendar;
