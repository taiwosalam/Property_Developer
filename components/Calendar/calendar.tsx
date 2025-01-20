"use client";

import { useMemo, useState } from "react";

import {
  getYear,
  getMonth,
  subMonths,
  addMonths,
  startOfMonth,
  isSameDay,
} from "date-fns";

// Imports
import Button from "../Form/Button/button";
import { CalendarContext } from "./calendar-context";
import { SectionSeparator } from "../Section/section-components";

import {
  CalendarDay,
  CalendarWeekDays,
  CalendarEventsTags,
} from "./calendar-components";

import CalendarHeader from "./calendar-header";
import { Calendar, calendar_event_tags } from "./data";
import CalendarActivities from "./calendar-activities";
import { calendar_events } from "./events";
import Cookies from 'js-cookie'
import { useRole } from "@/hooks/roleContext";


const CalendarComponent = () => {
   const { role, setRole } = useRole();
  const today = new Date();
  
  const isStaff = role === 'staff';
  // States
  const [activeDate, setActiveDate] = useState(today);
  const [currentDate, setCurrentDate] = useState(startOfMonth(today));
  const events = calendar_events;
  // Memos
  const { activities } = useMemo(() => {
    const activities = events.filter((event) =>
      isSameDay(event.date, activeDate)
    );

    return { activities };
  }, [activeDate, events]);

  // Initialize the Calendar instance with month and year
  const data = new Calendar({
    month: getMonth(currentDate),
    year: getYear(currentDate),
    events,
  });

  const { calendarDays } = data;

  return (
    <CalendarContext.Provider
      value={{
        ...data,
        // Using date-fns' addMonths function to increment the month
        nextMonth: () => setCurrentDate((prev) => addMonths(prev, 1)),

        // Using date-fns' subMonths function to decrement the month
        prevMonth: () => setCurrentDate((prev) => subMonths(prev, 1)),
      }}
    >
      <div className="flex flex-col lg:flex-row gap-x-10 gap-y-8">
        <div
          className="lg:flex-1 custom-flex-col gap-4 overflow-hidden rounded-lg bg-white dark:bg-darkText-primary"
          style={{
            border: "1px solid rgba(193, 194, 195, 0.40)",
            boxShadow:
              "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
          }}
        >
          <div className="p-[18px] pb-0 bg-brand-1 custom-flex-col gap-2">
            <CalendarHeader />
            <div className="w-full overflow-x-auto custom-round-scrollbar pb-[18px]">
              <CalendarEventsTags events={calendar_event_tags} />
            </div>
          </div>
          <div className="custom-flex-col gap-4 p-[18px]">
            <div className="custom-flex-col gap-4">
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
            </div>
            <SectionSeparator
              style={{ backgroundColor: "rgba(120, 122, 126, 0.20)" }}
            />
           {!isStaff && <div className="flex justify-end">
              <Button
                size="sm_medium"
                className="py-2 px-8"
                href="/tasks/calendars/manage"
              >
                manage
              </Button>
            </div>}
          </div>
        </div>
        <div style={{ maxHeight: "460px" }} className="lg:w-[40%]">
          <CalendarActivities date={activeDate} events={activities} />
        </div>
      </div>
    </CalendarContext.Provider>
  );
};

export default CalendarComponent;
