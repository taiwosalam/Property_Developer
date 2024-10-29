"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Images
import { ChevronLeft } from "@/public/icons/icons";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Imports
import Button from "@/components/Form/Button/button";
import { Calendar } from "@/components/Calendar/data";

import {
  format,
  getYear,
  getMonth,
  setMonth,
  addMonths,
  subMonths,
  startOfMonth,
} from "date-fns";

import {
  EventCalendarDay,
  EventCalendarWeekDays,
} from "@/components/tasks/Examine/EventCalendar/event-calendar-components";

import { Modal, ModalContent } from "@/components/Modal/modal";
import CreateExamineModal from "@/components/tasks/Examine/create-examine-modal";

const CreateNewExamine = () => {
  // Hooks
  const router = useRouter();

  // States
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));

  // Constants
  const data = new Calendar({
    month: getMonth(currentDate),
    year: getYear(currentDate),
  });
  const { year, month, calendarDays } = data;

  // Functions
  const handleBack = () => {
    router.back();
  };

  const goToToday = () => setCurrentDate(startOfMonth(new Date()));

  const nextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));

  const prevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));

  return (
    <div className="custom-flex-col gap-6">
      <div className="flex items-center justify-between py-3 border-t border-b border-solid border-[#EAECF0]">
        <div className="flex items-center gap-4 text-black text-xl font-medium capitalize">
          <button onClick={handleBack} type="button" aria-label="Go Back">
            <ChevronLeft />
          </button>
          <button onClick={goToToday}>Today</button>
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="py-2 px-1">
              <ArrowLeft size={18} color="#696B70" />
            </button>
            <button onClick={nextMonth} className="py-2 px-1">
              <ArrowRight size={18} color="#696B70" />
            </button>
          </div>
          <p>
            {format(setMonth(new Date(year, 0), month), "MMMM")} {year}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm_medium" variant="border" className="py-[10px] px-4">
            month
          </Button>
          <Button size="sm_medium" className="py-[10px] px-4">
            + create new
          </Button>
        </div>
      </div>
      <div className="rounded-lg border border-solid border-[#B9B9B9] bg-white pt-6 pb-4 px-7">
        <div className="custom-flex-col">
          <EventCalendarWeekDays />
          <div className="grid grid-cols-7 border-x border-solid border-[rgba(63,63,63,0.1)]">
            {calendarDays.map((day, index) => (
              <EventCalendarDay
                {...day}
                key={index}
                onClick={() => setIsOpen(true)}
                removeBorder={{ right: (index + 1) % 7 === 0 ? true : false }}
              />
            ))}
          </div>
        </div>
      </div>
      <Modal state={{ isOpen, setIsOpen }}>
        <ModalContent>
          <CreateExamineModal />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CreateNewExamine;
