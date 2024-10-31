"use client";

import React from "react";

// imports
import { format, setMonth } from "date-fns";
import { useEventCalendar } from "./event-calendar-context";
import { SectionSeparator } from "@/components/Section/section-components";

import {
  CalendarDay,
  CalendarWeekDays,
} from "@/components/Calendar/calendar-components";

import clsx from "clsx";
import useWindowWidth from "@/hooks/useWindowWidth";
import { Calendar } from "@/components/Calendar/data";

const YearEventCalendar = () => {
  const { year, openModal, openActivityModal } = useEventCalendar();

  const { isCustom, isSmallTablet } = useWindowWidth(1280);

  // Array representing months by index (0 for January, 1 for February, ...)
  const months = Array.from({ length: 12 }, (_, index) => index);

  return (
    <div className="flex gap-y-10 justify-between flex-wrap">
      {months.map((month, index) => {
        const monthData = new Calendar({ month, year });

        const monthDays = monthData.calendarDays;

        return (
          <div
            key={index}
            className={clsx("w-full md:w-[48%] xl:w-[32%] flex", {
              "justify-start":
                !isSmallTablet && isCustom ? index % 2 === 0 : index % 3 === 0,
              "justify-center": isSmallTablet || (!isCustom && index % 3 === 1),
              "justify-end":
                !isSmallTablet && isCustom ? index % 2 !== 0 : index % 3 === 2,
            })}
          >
            <div className="p-[18px] rounded-sm bg-neutral-3 custom-flex-col gap-2">
              <p>
                {format(setMonth(new Date(year, 0), month), "MMMM")} {year}
              </p>
              <SectionSeparator />
              <div className="custom-flex-col gap-1">
                <CalendarWeekDays type="short" />
                <div className="grid grid-cols-7 gap-3">
                  {monthDays.map((day, index) => (
                    <CalendarDay
                      key={index}
                      {...day}
                      onClick={
                        day.hasEvent
                          ? () => {
                              openActivityModal(day.date);
                            }
                          : openModal
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default YearEventCalendar;
