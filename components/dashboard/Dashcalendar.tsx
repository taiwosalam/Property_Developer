"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useRouter } from "next/navigation";

import { Modal, ModalContent } from "@/components/Modal/modal";
import CalendarActivities from "../Calendar/calendar-activities";
import { CalendarContext } from "../Calendar/calendar-context";
import { EventCalendarContext } from "../tasks/Examine/EventCalendar/event-calendar-context";
import { getCurrentWeekData } from "../tasks/Examine/EventCalendar/data";

const DashboarddCalendar = () => {
  const [activeDate, setActiveDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventProps[]>(
    []
  );
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const router = useRouter();

  const {
    data: calendarEventApiResponse,
    loading,
    error,
  } = useFetch<CalendarEventsApiResponse>("/company/calender");

  useEffect(() => {
    if (calendarEventApiResponse) {
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

  const [activityModalIsOpen, setActivityModalIsOpen] = useState(false);

  const handleDayClick = (day: any) => {
    setActiveDate(day.date);
    console.log(day.date, "Clicked!");
    setActivityModalIsOpen(true);
    // router.push(`/tasks/calendars`, { scroll: true });
  };

  const { calendarDays, month, year } = data;

  const { activities, eventsByDate } = useMemo(() => {
    // Group events by date for multiple event detection
    const eventsByDate = calendarEvents?.reduce((acc, event) => {
      const dateKey = event.date.toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {} as Record<string, CalendarEventProps[]>);

    // Get activities for the active date
    const activities = calendarEvents
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
            originalType: event.title, // Preserve original type
            eventCount: eventsOnDay.length,
            isMultiple: true, // Flag for multiple events
            title: `${event.title} (Part of ${eventsOnDay.length} events: ${allEventTypes})`, // Keep original title
          };
        }
        return {
          ...event,
          originalType: event.title, // Ensure originalType is always set
          isMultiple: false,
        };
      });

    return { activities, eventsByDate };
  }, [activeDate, calendarEvents]);

  // Constants

  const openActivityModal = (date: Date) => {
    setActiveDate(date);
    setActivityModalIsOpen(true);
  };
  const openModal = () => setModalIsOpen(true);
  const weekData = getCurrentWeekData(currentDate);

  return (
    <>
      <EventCalendarContext.Provider
        value={{
          ...data,
          weekData,

          openModal,
          openActivityModal,
        }}
      >
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
                  onClick={() => handleDayClick(day)}
                  isActive={isSameDay(day.date, activeDate)}
                  {...day}
                />
              ))}
            </div>
          </div>
        </div>
      </EventCalendarContext.Provider>

      <Modal
        state={{
          isOpen: activityModalIsOpen,
          setIsOpen: setActivityModalIsOpen,
        }}
      >
        <ModalContent>
          <div className="w-[95vw] max-w-[500px] max-h-[600px] h-[550px]">
            <CalendarActivities
              date={activeDate}
              events={activities ?? []}
              setIsOpen={setActivityModalIsOpen}
            />
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DashboarddCalendar;
