import React from "react";
import { Staff, Shift } from "./data";
import { format } from "date-fns";

interface MonthCalendarProps {
  month: Date;
  staffData: Staff[];
  onDayClick: (
    date: Date,
    shiftsForDay: { staff: Staff; shifts: Shift[] }[]
  ) => void;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  month,
  staffData,
  onDayClick,
}) => {
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const firstDayIndex = startOfMonth.getDay();
  const totalDays = endOfMonth.getDate();

  // Build weeks
  const weeks: Array<Array<number | null>> = [];
  let currentDay = 1 - firstDayIndex;

  while (currentDay <= totalDays) {
    const week: Array<number | null> = [];
    for (let i = 0; i < 7; i++) {
      week.push(currentDay > 0 && currentDay <= totalDays ? currentDay : null);
      currentDay++;
    }
    weeks.push(week);
  }

  return (
    <div className="border rounded-md shadow-sm border-gray-300">
      {/* Weekday headers */}
      <div className="grid grid-cols-7  border-b border-gray-300">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="font-semibold px-2 uppercase text-lg text-gray-500 text-left py-2 border-r last:border-r-0 border-gray-300"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {weeks.flatMap((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const key = `${weekIndex}-${dayIndex}`;

            if (!day)
              return (
                <div
                  key={key}
                  className="h-[8rem] cursor-not-allowed border-b border-r border-gray-300"
                />
              );

            const date = new Date(month.getFullYear(), month.getMonth(), day);
            const dateStr = format(date, "yyyy-MM-dd");

            const shiftsForDay = staffData
              .map((staff) => ({
                staff,
                shifts: staff.schedules[dateStr] || [],
              }))
              .filter(({ shifts }) => shifts.length > 0);

            return (
              <div
                key={key}
                className="flex flex-col justify-between h-[8rem] cursor-pointer border-b border-r border-gray-300 hover:bg-gray-50"
                onClick={() => onDayClick(date, shiftsForDay)}
              >
                <div className="text-2xl text-gray-500 font-medium text-center">
                  {day}
                </div>
                <div
                  className={` ${
                    shiftsForDay.length > 0 && "py-4"
                  } px-1 text-lg border-l-4 border-l-purple-500 bg-purple-200 text-purple-950 text-left mt-auto`}
                >
                  {shiftsForDay.length > 0 ? "Assigned" : ""}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
