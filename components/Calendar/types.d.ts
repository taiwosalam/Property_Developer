// Types
import type { Color } from "@/types/global";

export interface CalendarClassData {
  month: number;
  year: number;
  targetDate: Date;
  daysInWeek: number;
  calendarDays: CalendarDayProps[];
}

export interface CalendarContextProps extends CalendarClassData {
  nextMonth: () => void;
  prevMonth: () => void;
}

export interface CalendarEventTagProps {
  title: string;
  color?: Color;
  rounded?: boolean;
}

export interface CalendarDayProps {
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
}

export interface CalendarEventsProps {
  events: CalendarEventTagProps[];
}
