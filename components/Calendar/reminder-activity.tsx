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

export const ReminderActivity = ({
  desc,
  type,
  title,
  originalType,
  created_at,
}: CalendarEventProps) => {
  return (
    <>
      <div className="flex gap-4">
        <div
          className="w-1"
          style={{
            backgroundColor:
              calendar_event_tags[
                originalType as keyof typeof calendar_event_tags
              ] ||
              calendar_event_tags[type as keyof typeof calendar_event_tags] ||
              "#000000", // fallback color
          }}
        />
        <div className="w-full">
          <div className="flex justify-between items-start w-full">
            <p className="text-text-primary text-sm font-normal">
              <span className="capitalize font-bold dark:text-white text-base">
                {title}
              </span>
            </p>
            <p className="text-sm text-slate-400 dark:text-darkText-2">
              {created_at}
            </p>
          </div>
          <div
            className="dark:text-darkText-2"
            dangerouslySetInnerHTML={{ __html: desc }}
          />
        </div>
      </div>
    </>
  );
};
