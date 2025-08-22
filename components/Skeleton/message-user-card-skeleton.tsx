import React from "react";

const MessageUserCardSkeleton = () => {
  return (
    <div className="flex items-center gap-4 mt-4 animate-pulse">
      <div className="h-14 w-14 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      <div className="flex flex-col space-y-2">
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export default MessageUserCardSkeleton;
