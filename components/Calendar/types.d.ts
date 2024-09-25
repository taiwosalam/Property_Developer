// Types
import type { Color } from "@/types/global";

export interface CalendarEventTagProps {
  color?: Color;
  rounded?: boolean;
  children: React.ReactNode;
}

export interface CalendarDayProps {
  children: React.ReactNode;
}
