import Skeleton from "@mui/material/Skeleton";
import { ChevronRight } from "lucide-react";

const CalendarSkeletonLoader = () => {
  return (
    <div className="space-y-9">
      {/* Calendar Component Skeleton */}
      <div className="custom-flex-col gap-8">
        <div className="page-title-container h-16">
          <Skeleton
            variant="text"
            width={150}
            height={30}
            animation="wave"
            sx={{ transform: "none" }}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-x-10 gap-y-8">
          {/* Calendar Grid Skeleton */}
          <div
            className="lg:flex-1 custom-flex-col gap-4 overflow-hidden rounded-lg bg-white dark:bg-darkText-primary"
            style={{
              border: "1px solid rgba(193, 194, 195, 0.40)",
              boxShadow:
                "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
            }}
          >
            <div className="p-[18px] pb-0 bg-brand-1 dark:bg-[#3d3c37] custom-flex-col gap-2">
              {/* Calendar Header Skeleton */}
              <div className="flex justify-between items-center">
                <Skeleton
                  variant="text"
                  width={200}
                  height={30}
                  animation="wave"
                  sx={{ transform: "none" }}
                />
                <div className="flex gap-2">
                  <Skeleton
                    variant="circular"
                    width={30}
                    height={30}
                    animation="wave"
                    sx={{ transform: "none" }}
                  />
                  <Skeleton
                    variant="circular"
                    width={30}
                    height={30}
                    animation="wave"
                    sx={{ transform: "none" }}
                  />
                </div>
              </div>
              {/* Event Tags Skeleton */}
              <div className="w-full overflow-x-auto custom-round-scrollbar pb-[18px]">
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="rectangular"
                      width={80}
                      height={20}
                      animation="wave"
                      sx={{ transform: "none", borderRadius: "4px" }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="custom-flex-col gap-4 p-[18px]">
              {/* Weekdays Skeleton */}
              <div className="grid grid-cols-7 gap-3">
                {Array.from({ length: 7 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="text"
                    width={40}
                    height={20}
                    animation="wave"
                    sx={{ transform: "none" }}
                  />
                ))}
              </div>
              {/* Calendar Days Grid Skeleton */}
              <div className="grid grid-cols-7 gap-3">
                {Array.from({ length: 35 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    width={40}
                    height={40}
                    animation="wave"
                    sx={{ transform: "none", borderRadius: "4px" }}
                  />
                ))}
              </div>
              {/* Separator and Button Skeleton */}
              <div className="flex flex-col gap-4">
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={1}
                  animation="wave"
                  sx={{ transform: "none", backgroundColor: "rgba(120, 122, 126, 0.20)" }}
                />
                <div className="flex justify-end">
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={32}
                    animation="wave"
                    sx={{ transform: "none", borderRadius: "4px" }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Activities Sidebar Skeleton */}
          <div style={{ maxHeight: "460px" }} className="lg:w-[40%]">
            <div className="custom-flex-col gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width="100%"
                  height={80}
                  animation="wave"
                  sx={{ transform: "none", borderRadius: "4px" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Upcoming Events Section Skeleton */}
      <div className="page-title-container">
        <Skeleton
          variant="text"
          width={150}
          height={30}
          animation="wave"
          sx={{ transform: "none" }}
        />
        <div className="flex gap-2 items-center">
          <Skeleton
            variant="text"
            width={50}
            height={20}
            animation="wave"
            sx={{ transform: "none" }}
          />
          <ChevronRight />
        </div>
      </div>
      {/* Table Skeleton */}
      <div className="scroll-m-8 pb-10" id="event">
        <div className="custom-flex-col gap-4">
          {/* Table Header Skeleton */}
          <div className="flex bg-gray-100 dark:bg-darkText-primary h-[45px] items-center">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="text"
                width={100}
                height={20}
                animation="wave"
                sx={{ transform: "none", marginLeft: "16px" }}
              />
            ))}
          </div>
          {/* Table Rows Skeleton */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex border-b border-gray-200 py-2">
              {Array.from({ length: 4 }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  variant="text"
                  width={100}
                  height={20}
                  animation="wave"
                  sx={{ transform: "none", marginLeft: "16px" }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarSkeletonLoader;