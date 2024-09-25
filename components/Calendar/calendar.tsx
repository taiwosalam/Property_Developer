import React from "react";

// Images
import { ArrowLeft, ArrowRight } from "lucide-react";

// Imports
import Button from "../Form/Button/button";
import { CalendarDay, CalendarEventTag } from "./calendar-components";
import { SectionSeparator } from "../Section/section-components";
import { calendar_header } from "./data";

const Calendar = () => {
  return (
    <div
      className="w-[618px] custom-flex-col gap-4 overflow-hidden rounded-lg bg-white"
      style={{
        border: "1px solid rgba(193, 194, 195, 0.40)",
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="p-[18px] bg-[#eff6ff81] custom-flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-black text-base font-medium">January 2024</p>
          <div className="flex gap-3">
            <button>
              <ArrowLeft size={18} color="#696B70" />
            </button>
            <button>
              <ArrowRight size={18} color="#696B70" />
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <CalendarEventTag>new rent</CalendarEventTag>
          <CalendarEventTag color="#01BA4C">inspection</CalendarEventTag>
          <CalendarEventTag color="#2DD4BF">complaints</CalendarEventTag>
          <CalendarEventTag color="#8C62FF">due rent</CalendarEventTag>
          <CalendarEventTag color="#0033C4">maintenance</CalendarEventTag>
          <CalendarEventTag color="#E9212E">multiple event</CalendarEventTag>
        </div>
      </div>
      <div className="custom-flex-col gap-4 p-[18px]">
        <div className="custom-flex-col gap-4">
          <div className="flex justify-between">
            {calendar_header.map((day, index) => (
              <p
                key={index}
                className="w-fit text-text-tertiary text-sm font-normal uppercase"
              >
                {day}
              </p>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-3">
            {Array(31)
              .fill(null)
              .map((_, index) => (
                <CalendarDay key={index}>{index + 1}</CalendarDay>
              ))}
          </div>
        </div>
        <SectionSeparator
          style={{ backgroundColor: "rgba(120, 122, 126, 0.20)" }}
        />
        <div className="flex justify-end">
          <Button size="sm_medium" className="py-2 px-8">
            manage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
