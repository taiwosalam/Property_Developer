// Types
import type { CalendarDayProps, CalendarEventTagProps } from "./types";

// Imports
import clsx from "clsx";

export const CalendarEventTag: React.FC<CalendarEventTagProps> = ({
  color = "#adafb0",
  rounded,
  children,
}) => (
  <div className="flex gap-1 items-center">
    <div
      className={clsx("w-[5px] h-[5px]", { "rounded-full": rounded })}
      style={{ backgroundColor: color }}
    ></div>
    <p className="text-text-label text-sm font-medium capitalize">{children}</p>
  </div>
);

export const CalendarDay: React.FC<CalendarDayProps> = ({ children }) => (
  <div className="w-8 h-8 rounded-sm flex items-center justify-center bg-neutral-3">
    <p className="text-text-tertiary text-base font-normal">{children}</p>
  </div>
);
