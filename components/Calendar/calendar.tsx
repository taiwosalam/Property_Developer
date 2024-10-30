"use client";

import React, { useState } from "react";

import {
  getYear,
  getMonth,
  subMonths,
  addMonths,
  startOfMonth,
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

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));

  // Initialize the Calendar instance with month and year
  const data = new Calendar({
    month: getMonth(currentDate),
    year: getYear(currentDate),
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
      <div
        className="w-full max-w-[618px] custom-flex-col gap-4 overflow-hidden rounded-lg bg-white dark:bg-black"
        style={{
          border: "1px solid rgba(193, 194, 195, 0.40)",
          boxShadow:
            "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
        }}
      >
        <div className="p-[18px] pb-0 bg-[#eff6ff81] custom-flex-col gap-2">
          <CalendarHeader />
          <div className="w-full overflow-x-auto pb-[18px]">
            <CalendarEventsTags events={calendar_event_tags} />
          </div>
        </div>
        <div className="custom-flex-col gap-4 p-[18px]">
          <div className="custom-flex-col gap-4">
            <CalendarWeekDays />
            <div className="grid grid-cols-7 gap-3">
              {calendarDays.map((day, index) => (
                <CalendarDay key={index} {...day} />
              ))}
            </div>
          </div>
          <SectionSeparator
            style={{ backgroundColor: "rgba(120, 122, 126, 0.20)" }}
          />
          <div className="flex justify-end">
            <Button
              size="sm_medium"
              className="py-2 px-8"
              href="/tasks/calendars/manage"
            >
              manage
            </Button>
          </div>
        </div>
      </div>
    </CalendarContext.Provider>
  );
};

export default CalendarComponent;
