// Types
import { calendar_week_days } from "./data";

// Imports
import type {
  CalendarDayProps,
  CalendarEventsProps,
  CalendarEventTagProps,
} from "./types";

// Imports
import clsx from "clsx";

export const CalendarEventTag: React.FC<CalendarEventTagProps> = ({
  title,
  rounded,
  color = "#adafb0",
}) => (
  <div className="flex gap-1 items-center">
    <div
      className={clsx("w-[5px] h-[5px]", { "rounded-full": rounded })}
      style={{ backgroundColor: color }}
    ></div>
    <p className="text-text-label text-sm font-medium capitalize">{title}</p>
  </div>
);

export const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  isToday,
  isCurrentMonth,
}) => (
  <div
    className={clsx(
      "w-8 h-8 m-auto rounded-sm flex items-center justify-center",
      {
        "bg-white": isToday,
        "bg-neutral-3": !isToday && isCurrentMonth,
        "opacity-50": !isCurrentMonth,
      }
    )}
    style={{
      boxShadow: isToday ? " 0px 0px 5px 0px rgba(0, 0, 0, 0.25)" : undefined,
    }}
  >
    <p className="text-text-tertiary text-base font-normal">{date.getDate()}</p>
  </div>
);

export const CalendarWeekDays = () => (
  <div className="grid grid-cols-7 gap-3">
    {calendar_week_days.map((day, index) => (
      <p
        key={index}
        className="m-auto text-text-tertiary text-sm font-normal uppercase"
      >
        {day}
      </p>
    ))}
  </div>
);

export const CalendarEvents: React.FC<CalendarEventsProps> = ({ events }) => (
  <div className="flex gap-2">
    {events.map((event, index) => (
      <CalendarEventTag key={index} {...event} />
    ))}
  </div>
);
