// Types
import { calendar_event_tags, calendar_week_days } from "./data";

// Imports
import type {
  CalendarDayProps,
  CalendarEventProps,
  CalendarWeekDaysProps,
  CalendarEventTagsProps,
  CalendarEventTagItemProps,
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
    />
    <p className="text-text-label text-sm font-medium capitalize whitespace-nowrap">
      {title}
    </p>
  </div>
);

export const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  isToday,
  onClick,
  isActive,
  hasEvent,
  eventCount,
  isCurrentMonth,
  color = "#f5f5f5",
}) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      "relative w-8 h-8 m-auto rounded-sm flex items-center justify-center",
      {
        "opacity-50": !isCurrentMonth,
        "bg-white": isToday && isCurrentMonth,
        "outline outline-2 custom-primary-outline-color": isActive,
      }
    )}
    style={{
      backgroundColor: !isToday && isCurrentMonth ? color : undefined,
      boxShadow:
        isToday && isCurrentMonth
          ? " 0px 0px 5px 0px rgba(0, 0, 0, 0.25)"
          : undefined,
    }}
  >
    <p
      className={clsx("text-base font-normal", {
        "text-white": hasEvent && !isToday && isCurrentMonth,
        "text-text-tertiary hover:text-black":
          (!hasEvent && !isToday) || !isCurrentMonth,
      })}
    >
      {date.getDate()}
    </p>
    {eventCount > 1 && (
      <div className="absolute top-0 right-0 translate-x-[35%] -translate-y-[35%] w-4 h-4 rounded-full bg-[#FF1616] flex items-center justify-center">
        <p className="text-white text-[10px] font-medium">{eventCount}</p>
      </div>
    )}
  </button>
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

export const CalendarActivity: React.FC<CalendarEventProps> = ({
  desc,
  type,
  title,
}) => (
  <div className="flex gap-4">
    <div
      className="w-1"
      style={{ backgroundColor: calendar_event_tags[type] }}
    />
    <p className="p-1 text-text-primary text-sm font-normal">
      <span className="capitalize font-bold">{type}</span> || {desc}
    </p>
  </div>
);
