"use client";

import React, { useMemo } from "react";

// Imports
import { useEventCalendar } from "./event-calendar-context";

import {
  EventCalendarDay,
  EventCalendarWeekDays,
} from "@/components/tasks/Examine/EventCalendar/event-calendar-components";
import { CalendarEventProps } from "@/components/Calendar/types";
import { getMonth, getYear } from "date-fns";
import { Calendar } from "@/components/Calendar/data";

interface MonthEventCalendarProps {
  events?: CalendarEventProps[];
}

const MonthEventCalendar = ({ events }: MonthEventCalendarProps) => {
  const { openModal, openActivityModal, calendarDays, month, year } =
    useEventCalendar();

  // Group events by date and process multiple events
  const { eventsByDate, processedCalendarDays } = useMemo(() => {
    // Group events by date
    const eventsByDate = events?.reduce((acc, event) => {
      const dateKey = event.date.toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {} as Record<string, CalendarEventProps[]>);

    const calendar = new Calendar({
      month,
      year,
      events: events?.filter(
        (event) =>
          getMonth(event.date) === month && getYear(event.date) === year
      ),
    });

    // Process calendar days with event information
    const processedCalendarDays = calendar.calendarDays.map((day) => {
      const dateKey = day.date.toDateString();
      const dayEvents = eventsByDate?.[dateKey] || [];

      return {
        ...day,
        hasEvents: dayEvents.length > 0,
        eventCount: dayEvents.length,
        eventTypes: dayEvents.map((e) => e.type),
        events: dayEvents,
      };
    });

    return { eventsByDate, processedCalendarDays };
  }, [events, month, year]);

  return (
    <div className="rounded-lg border border-solid border-[#B9B9B9] bg-white pt-6 pb-4 px-7 overflow-x-auto custom-round-scrollbar">
      <div className="min-w-[800px] custom-flex-col">
        <EventCalendarWeekDays />
        <div className="grid grid-cols-7 border-x border-solid border-[rgba(63,63,63,0.1)]">
          {processedCalendarDays.map((day, index) => (
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
