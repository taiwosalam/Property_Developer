"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// Images
import { ChevronLeft } from "@/public/icons/icons";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";

// Imports
import Button from "@/components/Form/Button/button";
import { Calendar } from "@/components/Calendar/data";

import {
  format,
  getYear,
  addYears,
  subYears,
  getMonth,
  setMonth,
  addMonths,
  subMonths,
  startOfMonth,
  addWeeks,
  subWeeks,
  isSameDay,
} from "date-fns";

import { Modal, ModalContent } from "@/components/Modal/modal";
import { calendar_layouts, CalendarLayoutType } from "../options";
import CreateReminderMOdal from "@/components/tasks/calendars/create-reminder-modal";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/Dropdown/dropdown";

import clsx from "clsx";
import { SectionSeparator } from "@/components/Section/section-components";
import { getCurrentWeekData } from "@/components/tasks/Examine/EventCalendar/data";
import YearEventCalendar from "@/components/tasks/Examine/EventCalendar/year-event-calendar";
import WeekEventCalendar from "@/components/tasks/Examine/EventCalendar/week-event-calendar";
import MonthEventCalendar from "@/components/tasks/Examine/EventCalendar/month-event-calendar";
import { EventCalendarContext } from "@/components/tasks/Examine/EventCalendar/event-calendar-context";
import CalendarActivities from "@/components/Calendar/calendar-activities";
import { calendar_events } from "@/components/Calendar/events";
import { CalendarEventProps } from "@/components/Calendar/types";
import useFetch from "@/hooks/useFetch";
import { config } from "process";
import { transformEventTable, transformCalendarEvents } from "../data";
import { CalendarEventsApiResponse } from "../types";

const ManageCalendar = () => {
  // Hooks
  const router = useRouter();

  // States
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeDate, setActiveDate] = useState(new Date());
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [activityModalIsOpen, setActivityModalIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));
  const [activeLayout, setActiveLayout] = useState<CalendarLayoutType>("Month");

  // Memos
  // const { activities } = useMemo(() => {
  //   const activities = calendar_events.filter((event) =>
  //     isSameDay(event.date, activedate)
  //   );

  //   return { activities };
  // }, [activedate]);

  const [calendarEvents, setCalendarEvents] = useState<CalendarEventProps[]>(
    []
  );

  const {
    data: calendarEventApiResponse,
    loading,
    error,
    isNetworkError,
  } = useFetch<CalendarEventsApiResponse>("/company/calender");

  useEffect(() => {
    if (calendarEventApiResponse) {
      const eventsTable = transformEventTable(calendarEventApiResponse);
      //setEventTable(eventsTable);

      const events = transformCalendarEvents(calendarEventApiResponse);
      setCalendarEvents(events);
    }
  }, [calendarEventApiResponse]);

  //console.log(calendarEvents);

  // Constants
  const data = new Calendar({
    month: getMonth(currentDate),
    year: getYear(currentDate),
  });
  const { year, month } = data;
  const weekData = getCurrentWeekData(currentDate);

  // Functions
  const handleBack = () => {
    router.back();
  };

  const changeLayout = (newLayout: CalendarLayoutType) => {
    setDropdownIsOpen(false);
    setActiveLayout(newLayout);
  };

  const openModal = () => setModalIsOpen(true);
  const openActivityModal = (date: Date) => {
    setActiveDate(date);
    setActivityModalIsOpen(true);
  };

  const goToToday = () => setCurrentDate(new Date());

  // Move by 1 year
  const nextYear = () => setCurrentDate((prev) => addYears(prev, 1));
  const prevYear = () => setCurrentDate((prev) => subYears(prev, 1));

  // Move by 1 month
  const nextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));
  const prevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));

  // Move by 1 week
  const nextWeek = () => setCurrentDate((prev) => addWeeks(prev, 1));
  const prevWeek = () => setCurrentDate((prev) => subWeeks(prev, 1));
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

  return (
    <EventCalendarContext.Provider
      value={{
        ...data,
        weekData,

        openModal,
        openActivityModal,
      }}
    >
      <div className="custom-flex-col gap-6 pb-10">
        <div className="sticky top-[150px] z-10 bg-neutral-2 dark:bg-darkText-primary flex gap-6 items-center justify-between flex-wrap py-3 dark:border-none border-t border-b border-solid border-[#EAECF0]">
          <div className="flex items-center gap-4 text-black text-xl font-medium capitalize">
            <button
              className="dark:text-white"
              onClick={handleBack}
              type="button"
              aria-label="Go Back"
            >
              <ChevronLeft />
            </button>
            <button onClick={goToToday} className="dark:text-white text-black">
              Today
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={
                  activeLayout === "Year"
                    ? prevYear
                    : activeLayout === "Month"
                    ? prevMonth
                    : activeLayout === "Week"
                    ? prevWeek
                    : undefined
                }
                className="py-2 px-1"
              >
                <ArrowLeft size={18} color="#696B70" />
              </button>
              <button
                onClick={
                  activeLayout === "Year"
                    ? nextYear
                    : activeLayout === "Month"
                    ? nextMonth
                    : activeLayout === "Week"
                    ? nextWeek
                    : undefined
                }
                className="py-2 px-1"
              >
                <ArrowRight size={18} color="#696B70" />
              </button>
            </div>
            <p className="dark:text-white">
              {activeLayout === "Month"
                ? format(setMonth(new Date(year, 0), month), "MMMM")
                : activeLayout === "Week"
                ? weekData.title
                : null}{" "}
              {year}
            </p>
          </div>
          <div className="flex gap-2 dark:bg-darkText-primary">
            <Dropdown
              state={{ isOpen: dropdownIsOpen, setIsOpen: setDropdownIsOpen }}
            >
              <DropdownTrigger className="w-[104px] rounded-[4px] capitalize custom-border-button py-[10px] px-4 flex items-center justify-between">
                <p className="text-sm font-medium">{activeLayout}</p>
                <ChevronDown
                  size={16}
                  className={clsx("duration-150", {
                    "rotate-180": dropdownIsOpen,
                  })}
                />
              </DropdownTrigger>
              <DropdownContent
                position="left"
                className="w-full custom-flex-col"
                style={{ borderRadius: 0 }}
              >
                {calendar_layouts.map((layout, index) => (
                  <React.Fragment key={`${layout}-${index}`}>
                    <button
                      onClick={() => changeLayout(layout)}
                      className="py-1 px-3 font-medium text-start hover:bg-neutral-2 dark:hover:bg-gray-600"
                    >
                      {layout}
                    </button>
                    {
                      // Separator
                      index !== calendar_layouts.length - 1 && (
                        <SectionSeparator />
                      )
                    }
                  </React.Fragment>
                ))}
              </DropdownContent>
            </Dropdown>
            <Button
              size="sm_medium"
              onClick={openModal}
              className="py-[10px] px-4"
            >
              + create new
            </Button>
          </div>
        </div>
        {activeLayout === "Year" ? (
          <YearEventCalendar events={calendarEvents} />
        ) : activeLayout === "Month" ? (
          <MonthEventCalendar events={calendarEvents} />
        ) : activeLayout === "Week" ? (
          <WeekEventCalendar events={calendarEvents} />
        ) : null}
        <Modal state={{ isOpen: modalIsOpen, setIsOpen: setModalIsOpen }}>
          <ModalContent>
            <CreateReminderMOdal date={activeDate} isShowDate={true}/>
          </ModalContent>
        </Modal>
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
      </div>
    </EventCalendarContext.Provider>
  );
};

export default ManageCalendar;
