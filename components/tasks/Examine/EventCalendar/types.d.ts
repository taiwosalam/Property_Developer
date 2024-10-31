// Types
import type { Color } from "@/types/global";
import type {
  CalendarDayProps,
  CalendarClassData,
  CalendarEventProps,
} from "@/components/Calendar/types";

export interface EventCalendarWeekData {
  title: string;
  weekDates: string[];
  dayNumbers: string[];
}

export interface EventCalendarContextProps extends CalendarClassData {
  weekData: EventCalendarWeekData;
  openModal: () => void;
  openActivityModal: (date: Date) => void;
}

export interface EventCalendarDayProps extends CalendarDayProps {
  onClick: () => void;
  onEventClick: () => void;

  removeBorder?: {
    right?: boolean;
    bottom?: boolean;
  };
}

export interface EventCalendarEventProps extends CalendarEventProps {
  color: Color;
}
