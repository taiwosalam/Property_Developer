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
  "due rent": "#8C62FF",
  maintenance: "#0033C4",
  "multiple event": "#E9212E",
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

    return {
      date,
      events: events,
      isToday: isToday(date),
      isCurrentMonth: isSameMonth(date, this.targetDate),

      // Check if the date has any events
      eventCount: events.length,
      hasEvent: events.length > 0,
      color:
        events.length > 0 ? calendar_event_tags[events[0].type] : undefined,
    };
  }
}
