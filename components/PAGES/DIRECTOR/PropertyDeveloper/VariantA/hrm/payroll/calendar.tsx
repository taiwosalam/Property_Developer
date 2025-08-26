"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SimpleDatePickerProps {
  onDateChange: (date: Date) => void;
  initialDate?: Date;
}

const SimpleDatePicker: React.FC<SimpleDatePickerProps> = ({
  onDateChange,
  initialDate = new Date(),
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [currentMonth, setCurrentMonth] = useState(initialDate);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );

  const handleNextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  const renderDays = () => {
    const days = [];

    // Empty slots for first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear();

      days.push(
        <div
          key={day}
          className={`w-8 h-8 flex items-center justify-center cursor-pointer text-sm font-medium ${
            isSelected
              ? "bg-brand-9 text-white rounded"
              : "text-gray-700 hover:bg-gray-100 rounded"
          }`}
          onClick={() => handleDateClick(day)}
        >
          {day.toString().padStart(2, "0")}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="w-full shadow-lg rounded-md bg-white">
      {/* Month / Year Header with Navigation */}
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="font-semibold text-gray-900 text-base">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <div className="date flex justify-between items-center">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div
            key={index}
            className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500 uppercase"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {renderDays()}
      </div>
    </div>
  );
};

export default SimpleDatePicker;
