// Types
import type { Color } from "@/types/global";

// IMports
import { calendar_event_tags } from "./data";

// Calendar class and context
// --------------------------------------------------
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
// --------------------------------------------------

// Calendar events
// --------------------------------------------------
export interface CalendarEventProps {
  date: Date;
  desc: string;
  title: string;
  type: keyof typeof calendar_event_tags;
}
// --------------------------------------------------

// Calendar components
// --------------------------------------------------
export interface CalendarWeekDaysProps {
  type?: "short" | "long" | "full";
}

export interface CalendarEventTagsProps {
  events: Record<string, Color>;
}

export interface CalendarEventTagItemProps {
  title: string;
  color?: Color;
  rounded?: boolean;
}

export interface CalendarDayProps {
  date: Date;
  color?: Color;
  isToday: boolean;
  isActive?: boolean;
  hasEvent?: boolean;
  eventCount: number;
  onClick?: () => void;
  isCurrentMonth: boolean;
  events: CalendarEventProps[];
}

export interface CalendarActivitiesProps {
  date: Date;
  events: CalendarEventProps[];
}
// --------------------------------------------------
