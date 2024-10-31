"use client";

import React from "react";

// Imports
import { useEventCalendar } from "./event-calendar-context";

import {
  EventCalendarDay,
  EventCalendarWeekDays,
} from "@/components/tasks/Examine/EventCalendar/event-calendar-components";

const MonthEventCalendar = () => {
  const { openModal, openActivityModal, calendarDays } = useEventCalendar();

  return (
    <div className="rounded-lg border border-solid border-[#B9B9B9] bg-white pt-6 pb-4 px-7 overflow-x-auto custom-round-scrollbar">
      <div className="min-w-[800px] custom-flex-col">
        <EventCalendarWeekDays />
        <div className="grid grid-cols-7 border-x border-solid border-[rgba(63,63,63,0.1)]">
          {calendarDays.map((day, index) => (
            <EventCalendarDay
              {...day}
              key={index}
              onClick={openModal}
              onEventClick={() => openActivityModal(day.date)}
              removeBorder={{ right: (index + 1) % 7 === 0 ? true : false }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthEventCalendar;
