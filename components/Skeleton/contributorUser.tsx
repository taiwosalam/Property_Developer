import React from "react";

const ContributorUserSkeleton = () => {
  return (
    <div className="flex flex-col mt-6 gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="h-[154px] w-[154px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto md:mx-0" />
        <div className="flex flex-col gap-2">
          <div className="w-48 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="flex flex-row lg:flex-col gap-2">
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="w-40 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-48 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="flex items-center justify-center w-full">
        <div className="w-1/2 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );
};

export default ContributorUserSkeleton;

export const LoadingContributorUser = () => {
  return (
    <div className="bg-white shadow-md dark:bg-darkText-primary p-4 rounded-lg">
      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="flex flex-col mt-4 gap-2">
        <div className="flex gap-4">
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="flex gap-4">
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="flex gap-4">
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
      <ContributorUserSkeleton />
    </div>
  );
};
