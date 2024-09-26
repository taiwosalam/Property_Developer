"use client";

import React, { useState } from "react";
import {
  addMonths,
  getMonth,
  getYear,
  startOfMonth,
  subMonths,
} from "date-fns";

// Imports
import Button from "../Form/Button/button";
import { CalendarContext } from "./calendar-context";
import { SectionSeparator } from "../Section/section-components";

import {
  CalendarDay,
  CalendarEvents,
  CalendarWeekDays,
} from "./calendar-components";

import CalendarHeader from "./calendar-header";
import { Calendar, calendar_events } from "./data";

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
        className="w-[618px] custom-flex-col gap-4 overflow-hidden rounded-lg bg-white"
        style={{
          border: "1px solid rgba(193, 194, 195, 0.40)",
          boxShadow:
            "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
        }}
      >
        <div className="p-[18px] bg-[#eff6ff81] custom-flex-col gap-2">
          <CalendarHeader />
          <CalendarEvents events={calendar_events} />
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
            <Button size="sm_medium" className="py-2 px-8">
              manage
            </Button>
          </div>
        </div>
      </div>
    </CalendarContext.Provider>
  );
};

export default CalendarComponent;
