// Types
import { CalendarActivitiesProps } from "./types";

// Imports
import { CalendarActivity } from "./calendar-components";
import { format } from "date-fns";
import { X } from "lucide-react";

const CalendarActivities: React.FC<CalendarActivitiesProps> = ({
  events = [],
  date = new Date(),
  setIsOpen,
}) => {
  const closeModal = () => {
    if (!setIsOpen) return;
    setIsOpen(false);
  };

  return (
    <div
      className={`w-full h-full overflow-auto bg-white dark:bg-darkText-primary rounded-lg custom-flex-col gap-[18px]`}
      style={{
        border: "1px solid rgba(193, 194, 195, 0.40)",
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="p-[18px] flex justify-between gap-1 bg-brand-1 dark:bg-[#3c3d37] font-medium capitalize">
        <div className="flex-col gap-1">
          <p className="text-black text-base dark:text-white">Activities</p>
          <p className="text-text-label text-sm dark:text-gray-400">
            {format(date, "dd MMMM yyyy")}
          </p>
        </div>
        <button onClick={closeModal} className="text-xs items-start">
          <X size={19} />
        </button>
      </div>
      <div className="w-full pb-[18px] px-[18px] flex-1 overflow-y-auto custom-round-scrollbar">
        <div className="custom-flex-col gap-2">
          {!!events.length ? (
            events.map((event, index) => (
              <CalendarActivity
                key={`${event.originalType}-${index}`}
                {...event}
              />
            ))
          ) : (
            <p className="text-text-tertiary">No activities</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarActivities;
