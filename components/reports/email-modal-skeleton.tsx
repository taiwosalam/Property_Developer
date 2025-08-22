import React from "react";
export const EmailModalSkeleton: React.FC = () => {
  return (
    <div className="w-[600px] max-w-[80%] max-h-[85%] h-fit rounded-lg bg-white dark:bg-darkText-primary overflow-x-auto custom-round-scrollbar font-medium">
      {/* Header */}
      <div className="py-5 bg-brand-1 dark:bg-darkText-primary flex items-center justify-center sticky top-0 z-[2]">
        <span className="font-medium text-[16px] text-text-secondary dark:text-white">
          Email Details
        </span>
        <div className="absolute top-4 right-6 opacity-50"></div>
      </div>

      {/* Body */}
      <div className="bg-white dark:bg-darkText-primary p-6 text-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-text-secondary dark:text-darkText-1">
                From:
              </span>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-secondary dark:text-darkText-1">
                To:
              </span>
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-secondary dark:text-darkText-1">
              Headline:
            </span>
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

        <hr className="border-t-2 my-4 -mx-6 border-[#C0C2C833]" />

        <div className="space-y-[18px]">
          <div className="space-y-1">
            <p className="text-text-secondary dark:text-white">Message</p>
            <div className="space-y-2">
              <div className="h-36 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              {/* <div className="h-4 w-[90%] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-[85%] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-[70%] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div> */}
            </div>
          </div>

          {/* Attachment skeleton (showing conditionally) */}
          <div className="space-y-4">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-[100px] h-[100px] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="w-[100px] h-[100px] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        <hr className="border-t-2 my-6 border-brand-7 border-dotted" />

        <div className="space-y-3">
          <div className="py-4 px-[18px] rounded-lg bg-brand-1 dark:bg-[#3C3D37] space-y-1">
            <div className="flex items-center gap-2 justify-between">
              <span className="text-text-secondary dark:text-darkText-1">
                Date:
              </span>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
