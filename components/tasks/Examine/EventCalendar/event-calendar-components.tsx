import React from "react";

// Types
import type { EventCalendarDayProps, EventCalendarEventProps } from "./types";

// Imports
import clsx from "clsx";

import {
  calendar_week_days,
  calendar_event_tags,
} from "@/components/Calendar/data";

import { hexToRgb } from "@/utils/rgbaToHex";

export const EventCalendarWeekDays: React.FC = () => (
  <div className="rounded-t-xl bg-[#F1F4F9] grid grid-cols-7">
    {calendar_week_days.map((day, index) => (
      <div key={index} className="w-full pt-6 pb-3">
        <p className="text-center text-text-secondary text-sm font-medium uppercase">
          {day}
        </p>
      </div>
    ))}
  </div>
);

export const EventCalendarEvent: React.FC<EventCalendarEventProps> = ({
  color,
  title,
}) => {
  const alpha = 0.2;
  const rgbColor = hexToRgb(color) || "";
  const rgbParts = rgbColor.match(/\d+(\.\d+)?/g);

  const backgroundColor = rgbParts
    ? `rgba(${rgbParts[0]}, ${rgbParts[1]}, ${rgbParts[2]}, ${alpha})`
    : "#FFF";

  return (
    <div className="w-full flex" style={{ backgroundColor }}>
      <div className="w-[5px]" style={{ backgroundColor: color }}></div>
      <div className="py-[10px] px-3">
        <p className="text-xs font-normal" style={{ color }}>
          {title}
        </p>
      </div>
    </div>
  );
};

export const EventCalendarDay: React.FC<EventCalendarDayProps> = ({
  date,
  onClick,
  events = [],
  isCurrentMonth,
  removeBorder = { right: false, bottom: false },
}) => {
  const { right: removeRight, bottom: removeBottom } = removeBorder;

  return (
    <div
      className={clsx("w-full h-[120px] custom-flex-col", {
        "hover:bg-neutral-2 duration-150": isCurrentMonth,
      })}
    >
      <div className="flex h-full flex-1">
        <div className="flex-1 custom-flex-col justify-between">
          <button
            onClick={isCurrentMonth ? onClick : undefined}
            className={clsx("flex flex-1 justify-end pt-[14px] pb-[7px] pr-6", {
              "cursor-not-allowed": !isCurrentMonth,
            })}
          >
            <p
              className={clsx("text-base font-medium", {
                "text-text-secondary": isCurrentMonth,
                "text-text-disabled": !isCurrentMonth,
              })}
            >
              {date.getDate()}
            </p>
          </button>
          <div className="max-h-full overflow-y-auto custom-round-scrollbar">
            <div className="custom-flex-col">
              {isCurrentMonth &&
                events.map((event, index) => (
                  <EventCalendarEvent
                    key={index}
                    color={calendar_event_tags[event.type]}
                    {...event}
                  />
                ))}
            </div>
          </div>
        </div>
        {!removeRight && (
          <div className="w-[1px] bg-[rgba(63,63,63,0.1)]"></div>
        )}
      </div>
      {!removeBottom && <div className="h-[1px] bg-[rgba(63,63,63,0.1)]"></div>}
    </div>
  );
};
