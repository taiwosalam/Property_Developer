import React from "react";

// Imports
import clsx from "clsx";
import { format, getDate, parseISO } from "date-fns";
import { useEventCalendar } from "./event-calendar-context";
import { event_calendar_hours, filterEventsByDayAndHourRange } from "./data";

import {
  calendar_event_tags,
  calendar_week_days,
} from "@/components/Calendar/data";

import { EventCalendarEvent } from "./event-calendar-components";
import { CalendarEventProps } from "@/components/Calendar/types";

interface WeekEventCalendarProps {
  events?: CalendarEventProps[];
}

const WeekEventCalendar = ({ events }: WeekEventCalendarProps) => {
  const {
    openModal,
    openActivityModal,
    openReminderModal,
    weekData: { weekDates, dayNumbers },
  } = useEventCalendar();

  const today = new Date();
  const todayIndex = String(getDate(today));
  const todayDate = format(today, "yyyy-MM-dd");

  const isTodayInWeek = weekDates.includes(todayDate);

  return (
    <div className="custom-flex-col bg-[rgba(245,245,245,0.6)] dark:bg-darkText-primary">
      <div className="flex">
        <div className="w-20"></div>
        <div className="flex-1 grid grid-cols-7">
          {calendar_week_days.map((day, index) => (
            <div
              key={index}
              className="w-full pt-6 pb-4 flex flex-col items-center gap-2 font-medium"
            >
              <p
                className={clsx(
                  "text-xl uppercase",
                  dayNumbers[index] === todayIndex && isTodayInWeek
                    ? "text-black dark:text-white"
                    : "opacity-60 text-text-tertiary dark:text-darkText-1"
                )}
              >
                {day}
              </p>
              <p className="text-black dark:text-white text-2xl">
                {dayNumbers[index]}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[2px] bg-neutral-4"></div>
      <div className="flex gap-1">
        <div className="w-20">
          <div className="custom-flex-col">
            {event_calendar_hours.map((hour, index) => (
              <div
                key={index}
                className="w-full h-[70px] flex items-end justify-end"
              >
                <p className="text-text-tertiary text-base font-medium lowercase">
                  {hour}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 grid grid-cols-7">
          {weekDates.map((day, index) => (
            <div key={`${day}-${index}`} className="custom-flex-col">
              {event_calendar_hours.map((hour, idx) => {
                const matchingEvents =
                  events && filterEventsByDayAndHourRange(day, hour, events);

                return (
                  <div
                    key={`${hour}-${idx}`}
                    className="w-full h-[70px] custom-flex-col"
                  >
                    <div className="flex h-full flex-1">
                      <div
                        onClick={
                          !!matchingEvents?.length
                            ? () => {
                                openActivityModal(parseISO(day));
                              }
                            : () => {
                                openModal();
                                openReminderModal?.(parseISO(day));
                              }
                        }
                        className="flex-1 hover:bg-white dark:hover:bg-gray-600 cursor-pointer"
                      >
                        <div className="max-h-full overflow-y-auto custom-round-scrollbar">
                          <div className="custom-flex-col">
                            {matchingEvents?.map((event, index) => (
                              <EventCalendarEvent
                                key={index}
                                color={calendar_event_tags[event.type]}
                                {...event}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      {(index + 1) % 7 !== 0 && (
                        <div className="w-[1px] bg-neutral-4 opacity-50"></div>
                      )}
                    </div>
                    <div className="h-[1px] bg-neutral-4 opacity-50"></div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekEventCalendar;
