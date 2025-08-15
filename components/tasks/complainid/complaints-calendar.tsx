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
import {
  CalendarDay,
  CalendarWeekDays,
} from "@/components/Calendar/calendar-components";
import { Calendar } from "@/components/Calendar/data";
import { CalendarContext } from "@/components/Calendar/calendar-context";
import ComplaintsCalendarHeader from "./complaints-calendar-header";
import ComplaintsCalendarFooter from "./complaints-calendar-footer";
import { SectionSeparator } from "@/components/Section/section-components";
import { createReminder } from "@/app/(nav)/tasks/complaints/[complainId]/manage-complain/data";
import { CalendarEventProps } from "@/components/Calendar/types";
import CalendarActivities from "@/components/Calendar/calendar-activities";
import { ModalContent, Modal } from "@/components/Modal/modal";
import ReminderActivities from "@/components/Calendar/reminder-activities";

interface IReminder {
  date: Date;
  title: string;
  desc: string;
  type: "reminders";
}
const ComplaintsCalendar: React.FC<{
  header: string;
  buttonText: string;
  taskStatus?: boolean;
  reminders?: IReminder[];
  //   modalContent: React.ReactNode;
}> = ({ header, buttonText, taskStatus, reminders }) => {
  const today = new Date();
  const [activeDate, setActiveDate] = useState(today);
  const [currentDate, setCurrentDate] = useState(startOfMonth(today));
  const [activityModalIsOpen, setActivityModalIsOpen] = useState(false);

  const [loading, setIsLoading] = useState(false);

  const setYear = (year: number) => {
    const newDate = new Date(year, getMonth(currentDate));
    setCurrentDate(startOfMonth(newDate));
  };

  const { activities, eventsByDate } = useMemo(() => {
    // Group events by date for multiple event detection
    const eventsByDate = reminders?.reduce((acc, event) => {
      const dateKey = event.date.toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {} as Record<string, CalendarEventProps[]>);

    // Get activities for the active date
    const activities = reminders
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
            title: `${event.title}`,
            desc: `${event.desc}`,
          };
        }
        return event;
      });

    return { activities, eventsByDate };
  }, [activeDate, reminders]);

  // Initialize the Calendar instance with month and year
  const data = new Calendar({
    month: getMonth(currentDate),
    year: getYear(currentDate),
    events: reminders?.map((event) => {
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

  const openActivityModal = (date: Date) => {
    setActiveDate(date);
    setActivityModalIsOpen(true);
  };

  const openModal = () => {
    setActivityModalIsOpen(true);
  };

  return (
    <CalendarContext.Provider
      value={{
        ...data,
        nextMonth: () => setCurrentDate((prev) => addMonths(prev, 1)),
        prevMonth: () => setCurrentDate((prev) => subMonths(prev, 1)),
        setYear,
      }}
    >
      <div
        className="rounded-lg border border-[rgba(193,194,195,0.40)] bg-white dark:bg-darkText-primary"
        style={{
          boxShadow:
            "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
        }}
      >
        <ComplaintsCalendarHeader header={header} />
        <div className="py-4 px-3 rounded-b-lg space-y-4">
          <CalendarWeekDays />
          <div className="grid grid-cols-7 gap-3">
            {calendarDays.map((day, index) => (
              <CalendarDay
                key={index}
                onClick={() => {
                  setActiveDate(day.date);
                  !day.hasEvent
                    ? () => {
                        openActivityModal(day.date);
                      }
                    : openModal();
                }}
                isActive={isSameDay(day.date, activeDate)}
                {...day}
              />
            ))}
          </div>
          <SectionSeparator
            style={{ backgroundColor: "rgba(120, 122, 126, 0.20)" }}
          />
          <ComplaintsCalendarFooter
            activeDate={activeDate}
            buttonText={buttonText}
            taskStatus={taskStatus}
            // modalContent={modalContent}
          />
        </div>

        <Modal
          state={{
            isOpen: activityModalIsOpen,
            setIsOpen: setActivityModalIsOpen,
          }}
        >
          <ModalContent>
            <div className="w-[95vw] max-w-[500px] max-h-[600px] h-[550px]">
              <ReminderActivities
                date={activeDate}
                events={activities ?? []}
                setIsOpen={setActivityModalIsOpen}
              />
            </div>
          </ModalContent>
        </Modal>
      </div>
    </CalendarContext.Provider>
  );
};

export default ComplaintsCalendar;
