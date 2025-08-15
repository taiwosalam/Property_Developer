// Types
import type {
  CalendarDayProps,
  CalendarClassData,
  CalendarEventProps,
} from "./types";

// Imports
import {
  getDay,
  addDays,
  getYear,
  isToday,
  subDays,
  getMonth,
  isSameDay,
  endOfMonth,
  isSameMonth,
  startOfMonth,
  eachDayOfInterval,
} from "date-fns";

export const calendar_week_days = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

export const calendar_event_tags = {
  "new rent": "#FFBB53",
  inspections: "#01BA4C",
  complaints: "#2DD4BF",
  "due rent": "#E9212E",
  maintenance: "#0033C4",
  examines: "#621406",
  "multiple event": "#8C62FF",
  applications: "#e20be6",
  reminders: "#04b8f7",
} as const;

export class Calendar implements CalendarClassData {
  month: number;
  year: number;
  targetDate: Date;
  daysInWeek: number;
  calendarDays: CalendarDayProps[];
  events: CalendarEventProps[];

  constructor({
    month = getMonth(new Date()),
    year = getYear(new Date()),
    events = [] as CalendarEventProps[],
  } = {}) {
    this.month = month;
    this.year = year;
    this.targetDate = new Date(year, month);
    this.daysInWeek = 7; // Standard week length
    this.events = events;
    // Initialize the calendar days array
    this.calendarDays = this.generateDays();
  }

  // Generate the complete list of days for the calendar view
  generateDays() {
    const daysInTargetMonth = this.getDaysInTargetMonth();
    const prefixDays = this.getPrefixDays();
    const totalDaysInCalendar = daysInTargetMonth.length + prefixDays.length;
    const suffixDays = this.getSuffixDays(totalDaysInCalendar);

    const allDays = [...prefixDays, ...daysInTargetMonth, ...suffixDays];

    return allDays.map((date) => this.getDayDetails(date));
  }

  // Get the full date interval for the target month
  getDaysInTargetMonth() {
    const firstDayOfTargetMonth = startOfMonth(this.targetDate);
    const lastDayOfTargetMonth = endOfMonth(this.targetDate);

    return eachDayOfInterval({
      start: firstDayOfTargetMonth,
      end: lastDayOfTargetMonth,
    });
  }

  // Calculate the prefix days from the previous month
  getPrefixDays() {
    const firstDayOfTargetMonth = startOfMonth(this.targetDate);
    const prefixDaysNeeded = getDay(firstDayOfTargetMonth);

    return Array.from({ length: prefixDaysNeeded }, (_, i) =>
      subDays(firstDayOfTargetMonth, prefixDaysNeeded - i)
    );
  }

  // Calculate the suffix days from the next month
  getSuffixDays(totalDaysInCalendar: number) {
    const lastDayOfTargetMonth = endOfMonth(this.targetDate);
    const suffixDaysNeeded =
      totalDaysInCalendar % this.daysInWeek === 0
        ? 0
        : this.daysInWeek - (totalDaysInCalendar % this.daysInWeek);

    return Array.from({ length: suffixDaysNeeded }, (_, i) =>
      addDays(lastDayOfTargetMonth, i + 1)
    );
  }

  // Get detailed information for each date
  getDayDetails(date: Date): CalendarDayProps {
    const events = this.events.filter((event) => isSameDay(event.date, date));

    if (events.length > 1) {
      // If there are multiple events, preserve their original types
      events.forEach((event) => {
        event.originalType = event.type;
        event.type = "multiple event";
      });
    }

    return {
      date,
      events,
      isToday: isToday(date),
      isCurrentMonth: isSameMonth(date, this.targetDate),
      eventCount: events.length,
      hasEvent: events.length > 0,
      color:
        events.length > 0
          ? calendar_event_tags[
              events.length > 1 ? "multiple event" : events[0].type
            ]
          : undefined,
    };
  }
}
