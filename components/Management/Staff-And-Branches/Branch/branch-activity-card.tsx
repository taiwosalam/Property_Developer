import { CalendarEventProps } from "@/components/Calendar/types";
import useFetch from "@/hooks/useFetch";
import {
  ActivitiesIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@/public/icons/icons";
import clsx from "clsx";
// import activitiesIcon from "@/public/icons/activities.svg";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ActivityDisplay, CalendarEventsApiResponse } from "../types";
import { transformBranchActivities } from "../data";

interface ActivityItemProps {
  label: string;
  description: string;
  time: string;
  color: string;
}

interface BranchActivitiesCardProps {
  className?: string;
  branchId?: number;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  label,
  description,
  time,
  color,
}) => {
  return (
    <div className="flex items-start p-3">
      <div className={`w-1 h-10 mr-4 ${color} dark:text-white`}></div>
      <div>
        <div className="text-sm">
          <span className="font-bold dark:text-darkText-1">
            {label}
            {" || "}
          </span>
          <span className="dark:text-darkText-2">{description}</span>
        </div>
        <div className="text-sm text-gray-500">{time}</div>
      </div>
    </div>
  );
};

const BranchActivitiesCard: React.FC<BranchActivitiesCardProps> = ({
  className,
  branchId,
}) => {
  const PAGE_SIZE = 4;
  const [page, setPage] = useState(0);
  const {
    data: calendarEventApiResponse,
    loading,
    error,
    isNetworkError,
  } = useFetch<CalendarEventsApiResponse>(
    `/company/calender?branch_id=${branchId}`
  );

  const activities = useMemo(
    () =>
      calendarEventApiResponse?.data
        ? transformBranchActivities(calendarEventApiResponse.data)
        : [],
    [calendarEventApiResponse]
  );

  console.log("calendarEventApiResponse", calendarEventApiResponse);

  const pagedActivities = useMemo(
    () => activities.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [activities, page]
  );

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () =>
    setPage((p) => ((p + 1) * PAGE_SIZE < activities.length ? p + 1 : p));

  return (
    <div
      className={clsx(
        "h-[410px] rounded-lg bg-white dark:bg-darkText-primary overflow-hidden",
        className
      )}
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="flex justify-between items-center p-4 bg-brand-1 dark:bg-[#3c3d37]">
        <div className="">
          <h2 className="font-medium text-sm text-black dark:text-white">
            Branch Activities
          </h2>
          {/* <span className="text-text-label dark:text-darkText-2 text-sm font-medium">
            25 January 2023
          </span> */}
        </div>
        <div className="flex space-x-5 items-center text-text-tertiary dark:text-white">
          <button onClick={handlePrev} disabled={page === 0}>
            <ArrowLeftIcon />
          </button>
          <button
            onClick={handleNext}
            disabled={(page + 1) * PAGE_SIZE >= activities.length}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-darkText-primary py-4 px-2 text-text-primary rounded-b-lg">
        {pagedActivities.map((activity, index) => (
          <div key={index}>
            <ActivityItem
              label={activity.label}
              description={
                activity.description.length > 65
                  ? activity.description.substring(0, 65).concat("...")
                  : activity.description
              }
              time={activity.time}
              color={activity.color}
            />
            <div
              className="h-[1px] w-full bg-text-disabled bg-opacity-60"
              hidden={index === pagedActivities.length - 1}
            />
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="flex flex-col px-8 bg-white dark:bg-darkText-primary h-3/5 justify-center items-center text-center gap-6">
          <div className="w-full text-brand-9 flex items-center justify-center">
            <ActivitiesIcon size={50} />
          </div>
          <p className="font-normal text-xs text-brand-9">
            This branch currently has no activities. Once activities are
            available, they will be displayed here.
          </p>
        </div>
      )}
    </div>
  );
};

export default BranchActivitiesCard;
