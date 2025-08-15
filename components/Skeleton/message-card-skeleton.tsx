import clsx from "clsx";
import { SectionSeparator } from "../Section/section-components";

const MessageCardSkeleton = () => {
  return (
    <div className={clsx("custom-flex-col gap-4 animate-pulse")}> 
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-[60px] h-[60px] bg-gray-300 dark:bg-gray-600 rounded-full" />
          <div className="custom-flex-col gap-1 flex-1">
            <div className="flex items-center gap-[10px]">
              <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
            <div className="w-32 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center font-normal">
          <div className="w-12 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>
      </div>
      <SectionSeparator />
    </div>
  );
};

export default MessageCardSkeleton;