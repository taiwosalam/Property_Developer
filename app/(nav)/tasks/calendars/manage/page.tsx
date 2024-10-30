"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Images
import { ChevronLeft } from "@/public/icons/icons";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";

// Imports
import Button from "@/components/Form/Button/button";
import { Calendar } from "@/components/Calendar/data";

import {
  format,
  getYear,
  addYears,
  subYears,
  getMonth,
  setMonth,
  addMonths,
  subMonths,
  startOfMonth,
} from "date-fns";

import { Modal, ModalContent } from "@/components/Modal/modal";
import { calendar_layouts, CalendarLayoutType } from "../options";
import CreateReminderMOdal from "@/components/tasks/calendars/create-reminder-modal";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/Dropdown/dropdown";

import clsx from "clsx";
import { SectionSeparator } from "@/components/Section/section-components";
import MonthEventCalendar from "@/components/tasks/Examine/EventCalendar/month-event-calendar";
import { EventCalendarContext } from "@/components/tasks/Examine/EventCalendar/event-calendar-context";
import YearEventCalendar from "@/components/tasks/Examine/EventCalendar/year-event-calendar";

const ManageCalendar = () => {
  // Hooks
  const router = useRouter();

  // States
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));
  const [activeLayout, setActiveLayout] = useState<CalendarLayoutType>("Month");

  // Constants
  const data = new Calendar({
    month: getMonth(currentDate),
    year: getYear(currentDate),
  });
  const { year, month } = data;

  // Functions
  const handleBack = () => {
    router.back();
  };

  const changeLayout = (newLayout: CalendarLayoutType) => {
    setDropdownIsOpen(false);
    setActiveLayout(newLayout);
  };

  const openModal = () => setModalIsOpen(true);

  const goToToday = () => setCurrentDate(startOfMonth(new Date()));

  // Move by 1 year
  const nextYear = () => setCurrentDate((prev) => addYears(prev, 1));
  const prevYear = () => setCurrentDate((prev) => subYears(prev, 1));

  // Move by 1 month
  const nextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));
  const prevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));

  return (
    <EventCalendarContext.Provider
      value={{
        ...data,
        openModal,
      }}
    >
      <div className="custom-flex-col gap-6 pb-10">
        <div className="flex gap-6 items-center justify-between flex-wrap py-3 border-t border-b border-solid border-[#EAECF0]">
          <div className="flex items-center gap-4 text-black text-xl font-medium capitalize">
            <button onClick={handleBack} type="button" aria-label="Go Back">
              <ChevronLeft />
            </button>
            <button onClick={goToToday}>Today</button>
            <div className="flex items-center gap-3">
              <button
                onClick={activeLayout === "Year" ? prevYear : prevMonth}
                className="py-2 px-1"
              >
                <ArrowLeft size={18} color="#696B70" />
              </button>
              <button
                onClick={activeLayout === "Year" ? nextYear : nextMonth}
                className="py-2 px-1"
              >
                <ArrowRight size={18} color="#696B70" />
              </button>
            </div>
            <p>
              {activeLayout === "Month" &&
                format(setMonth(new Date(year, 0), month), "MMMM")}{" "}
              {year}
            </p>
          </div>
          <div className="flex gap-2">
            <Dropdown
              state={{ isOpen: dropdownIsOpen, setIsOpen: setDropdownIsOpen }}
            >
              <DropdownTrigger className="w-[104px] rounded-[4px] capitalize custom-border-button py-[10px] px-4 flex items-center justify-between">
                <p className="text-sm font-medium">{activeLayout}</p>
                <ChevronDown
                  size={16}
                  className={clsx("duration-150", {
                    "rotate-180": dropdownIsOpen,
                  })}
                />
              </DropdownTrigger>
              <DropdownContent
                position="left"
                className="w-full custom-flex-col"
                style={{ borderRadius: 0 }}
              >
                {calendar_layouts.map((layout, index) => (
                  <React.Fragment key={`${layout}-${index}`}>
                    <button
                      onClick={() => changeLayout(layout)}
                      className="py-1 px-3 font-medium text-start hover:bg-neutral-2"
                    >
                      {layout}
                    </button>
                    {
                      // Separator
                      index !== calendar_layouts.length - 1 && (
                        <SectionSeparator />
                      )
                    }
                  </React.Fragment>
                ))}
              </DropdownContent>
            </Dropdown>
            <Button
              size="sm_medium"
              onClick={openModal}
              className="py-[10px] px-4"
            >
              + create new
            </Button>
          </div>
        </div>
        {activeLayout === "Year" ? (
          <YearEventCalendar />
        ) : activeLayout === "Month" ? (
          <MonthEventCalendar />
        ) : activeLayout === "Week" ? null : null}
        <Modal state={{ isOpen: modalIsOpen, setIsOpen: setModalIsOpen }}>
          <ModalContent>
            <CreateReminderMOdal />
          </ModalContent>
        </Modal>
      </div>
    </EventCalendarContext.Provider>
  );
};

export default ManageCalendar;
