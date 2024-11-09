// Types
import { CalendarActivitiesProps } from "./types";

// Imports
import { CalendarActivity } from "./calendar-components";
import { format } from "date-fns";

const CalendarActivities: React.FC<CalendarActivitiesProps> = ({
  events = [],
  date = new Date(),
}) => {
  return (
    <div
      className="w-full h-full bg-white dark:bg-darkText-primary rounded-lg overflow-hidden custom-flex-col gap-[18px]"
      style={{
        border: "1px solid rgba(193, 194, 195, 0.40)",
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="p-[18px] custom-flex-col gap-1 bg-brand-1 font-medium capitalize">
        <p className="text-black text-base">Activities</p>
        <p className="text-text-label text-sm">
          {format(date, "dd MMMM yyyy")}
        </p>
      </div>
      <div className="w-full pb-[18px] px-[18px] flex-1 overflow-y-auto custom-round-scrollbar">
        <div className="custom-flex-col gap-2">
          {!!events.length ? (
            events.map((event, index) => (
              <CalendarActivity key={`${event.type}-${index}`} {...event} />
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
