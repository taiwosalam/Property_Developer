// Types
import type { Color } from "@/types/global";
import type {
  CalendarDayProps,
  CalendarClassData,
  CalendarEventProps,
} from "@/components/Calendar/types";

export interface EventCalendarContextProps extends CalendarClassData {
  openModal: () => void;
}

export interface EventCalendarDayProps extends CalendarDayProps {
  onClick: () => void;
  removeBorder?: {
    right?: boolean;
    bottom?: boolean;
  };
}

export interface EventCalendarEventProps extends CalendarEventProps {
  color: Color;
}
