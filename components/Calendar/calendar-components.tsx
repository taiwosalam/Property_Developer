// Types
import { calendar_week_days } from "./data";

// Imports
import type {
  CalendarDayProps,
  CalendarEventTagsProps,
  CalendarEventTagItemProps,
  CalendarWeekDaysProps,
} from "./types";

// Imports
import clsx from "clsx";

export const CalendarEventTagItem: React.FC<CalendarEventTagItemProps> = ({
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
  hasEvent,
  eventCount,
  isCurrentMonth,
  color = "#f5f5f5",
}) => (
  <div
    className={clsx(
      "relative w-8 h-8 m-auto rounded-sm flex items-center justify-center",
      {
        "bg-white": isToday,
        "opacity-50": !isCurrentMonth,
      }
    )}
    style={{
      backgroundColor: !isToday && isCurrentMonth ? color : undefined,
      boxShadow: isToday ? " 0px 0px 5px 0px rgba(0, 0, 0, 0.25)" : undefined,
    }}
  >
    <p
      className={clsx("text-base font-normal", {
        "text-white": hasEvent && !isToday,
        "text-text-tertiary": !hasEvent,
      })}
    >
      {date.getDate()}
    </p>
    {eventCount > 1 && (
      <div className="absolute top-0 right-0 translate-x-[35%] -translate-y-[35%] w-4 h-4 rounded-full bg-[#FF1616] flex items-center justify-center">
        <p className="text-white text-[10px] font-medium">{eventCount}</p>
      </div>
    )}
  </div>
);

export const CalendarWeekDays: React.FC<CalendarWeekDaysProps> = ({
  type = "long",
}) => (
  <div className="grid grid-cols-7 gap-3">
    {calendar_week_days.map((day, index) => (
      <p
        key={index}
        className="m-auto text-text-tertiary text-sm font-normal uppercase"
      >
        {type === "full"
          ? "Full 😂"
          : type === "long"
          ? day
          : type === "short"
          ? day.charAt(0)
          : null}
      </p>
    ))}
  </div>
);

export const CalendarEventsTags: React.FC<CalendarEventTagsProps> = ({
  events,
}) => (
  <div className="flex gap-2">
    {Object.entries(events).map(([title, color], index) => (
      <CalendarEventTagItem key={index} title={title} color={color} />
    ))}
  </div>
);
