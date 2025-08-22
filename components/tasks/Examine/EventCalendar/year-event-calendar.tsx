"use client";

import React, { useMemo, useState } from "react";

// imports
import {
  addMonths,
  format,
  getMonth,
  getYear,
  isSameDay,
  setMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useEventCalendar } from "./event-calendar-context";
import { SectionSeparator } from "@/components/Section/section-components";
import { CalendarEventsTags } from "@/components/Calendar/calendar-components";
import { calendar_event_tags } from "@/components/Calendar/data";

import {
  CalendarDay,
  CalendarWeekDays,
} from "@/components/Calendar/calendar-components";

import clsx from "clsx";
import useWindowWidth from "@/hooks/useWindowWidth";
import { Calendar } from "@/components/Calendar/data";
import { CalendarEventProps } from "@/components/Calendar/types";
import { CalendarContext } from "@/components/Calendar/calendar-context";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";

interface YearEventCalendarProps {
  events?: CalendarEventProps[];
}
const YearEventCalendar = ({ events }: YearEventCalendarProps) => {
  const { year, openModal, openActivityModal, openReminderModal } =
    useEventCalendar();

  const { isCustom, isSmallTablet } = useWindowWidth(1280);
  const today = new Date();
  const [activeDate, setActiveDate] = useState(today);
  const [currentDate, setCurrentDate] = useState(startOfMonth(today));

  // Array representing months by index (0 for January, 1 for February, ...)
  const months = Array.from({ length: 12 }, (_, index) => index);

  const { activities, eventsByDate } = useMemo(() => {
    // Group events by date for multiple event detection
    const eventsByDate = events?.reduce((acc, event) => {
      const dateKey = event.date.toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {} as Record<string, CalendarEventProps[]>);

    // Get activities for the active date
    const activities = events
      ?.filter((event) => isSameDay(event.date, activeDate))
      .map((event) => {
        const dateKey = event.date.toDateString();
        const eventsOnDay = eventsByDate?.[dateKey];

        // If multiple events exist on this day
        if (eventsOnDay && eventsOnDay.length > 1) {
          // Get all event types for this day
          const allEventTypes = eventsOnDay.map((e) => e.type).join(", ");

          return {
            ...event,
            type: "multiple event" as const,
            eventCount: eventsOnDay.length,
            originalType: event.type,
            title: `${event.type} (Part of multiple events: ${allEventTypes})`,
            desc: `${event.desc}`,
          };
        }
        return event;
      });

    return { activities, eventsByDate };
  }, [activeDate, events]);

  const data = new Calendar({
    month: getMonth(currentDate),
    year: getYear(currentDate),
    events: events?.map((event) => {
      const dateKey = event.date.toDateString();
      const eventsOnDay = eventsByDate?.[dateKey];
      if (eventsOnDay && eventsOnDay.length > 1) {
        return {
          ...event,
          type: "multiple event",
          eventCount: eventsOnDay.length,
        };
      }
      return event;
    }),
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
      <div className="flex gap-y-10 justify-between gap-x-5 flex-wrap w-full">
        {months.map((month, index) => {
          const monthData = new Calendar({
            month,
            year,
            events: events?.filter(
              (event) =>
                getMonth(event.date) === month && getYear(event.date) === year
            ),
          });

          return (
            <AutoResizingGrid minWidth={350} key={index}>
              {/* <div
              key={index}
              className={clsx(
                "w-full md:w-[48%] xl:w-[32%] flex justify-evenly",
                {
                  "justify-start":
                    !isSmallTablet && isCustom
                      ? index % 2 === 0
                      : index % 3 === 0,
                  "justify-center":
                    isSmallTablet || (!isCustom && index % 3 === 1),
                  "justify-end":
                    !isSmallTablet && isCustom
                      ? index % 2 !== 0
                      : index % 3 === 2,
                }
              )}
            > */}
              <div className="p-[18px] rounded-sm bg-neutral-3 dark:bg-darkText-primary custom-flex-col gap-2">
                <p>
                  {format(setMonth(new Date(year, 0), month), "MMMM")} {year}
                </p>

                {/* <div className="w-full overflow-x-auto custom-round-scrollbar pb-[18px]">
                <CalendarEventsTags events={calendar_event_tags} />
              </div> */}
                <SectionSeparator />
                <div className="custom-flex-col gap-1">
                  <CalendarWeekDays type="short" />
                  <div className="grid grid-cols-7 gap-3">
                    {monthData.calendarDays.map((day, dayIndex) => (
                      <CalendarDay
                        key={dayIndex}
                        {...day}
                        onClick={
                          day.hasEvent
                            ? () => {
                                openActivityModal(day.date);
                              }
                            : () => {
                                openModal();
                                openReminderModal?.(day.date);
                              }
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* </div> */}
            </AutoResizingGrid>
          );
        })}
      </div>
    </CalendarContext.Provider>
  );
};

export default YearEventCalendar;
