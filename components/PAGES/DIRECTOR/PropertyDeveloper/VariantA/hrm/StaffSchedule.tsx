import Button from "@/components/Form/Button/button";
import DateViewSelector, { DateState, WeekView } from "./schedule/card";
import { PlusIcon } from "lucide-react";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { fromDate, handleEditShift, staffData } from "./schedule/data";
import { useState } from "react";
import { MonthCalendar } from "./schedule/calendar";

const StaffSchedule = () => {
  const [state, setState] = useState<DateState>({
    view: "month",
    date: new Date("2024-02-01"),
    fromDate: new Date("2024-02-01"),
  });

  const handleDayClick = (
    date: Date,
    shiftsForDay: {
      staff: (typeof staffData)[number];
      shifts: (typeof staffData)[number]["schedules"][string];
    }[]
  ) => {
    // setSelectedDate(date);
    // setSelectedShifts(shiftsForDay);

    // Example: open your modal here and pass selectedShifts
    console.log("Clicked date:", date);
    console.log("Shifts for that day:", shiftsForDay);
  };
  return (
    <section>
      <div className="buttons flex justify-between items-center">
        <DateViewSelector state={state} setState={setState} />
        <div className="buttons flex gap-4 items-center">
          <Button className="flex items-center gap-2">
            {" "}
            <PlusIcon /> Create Shift
          </Button>
          <Button className="flex items-center gap-2">
            {" "}
            <PlusIcon /> Create Work Schedule
          </Button>
        </div>
      </div>

      <div className="items py-8">
        <FilterBar
          exports
          exportHref="defegh"
          isDateTrue
          hasGridListToggle={false}
          pageTitle="Staff Schedule"
          aboutPageModalData={{
            title: "Applications",
            description:
              "This page contains a list of Applications on the platform.",
            video: "",
          }}
          searchInputPlaceholder="Search application"
          handleFilterApply={() => {}}
          // filterOptionsMenu={DocumentssFilterOptionsWithDropdown}
        />
      </div>

      <div className="calendar">
        {state.view === "month" ? (
          <MonthCalendar
            month={state.date}
            staffData={staffData}
            onDayClick={handleDayClick}
          />
        ) : (
          <WeekView
            staffList={staffData}
            fromDate={state.fromDate}
            onEditShift={handleEditShift}
          />
        )}
      </div>
    </section>
  );
};
export default StaffSchedule;
