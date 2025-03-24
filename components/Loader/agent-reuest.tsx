import React from "react";

const AgentRequestLoader = () => {
  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-darkText-primary p-4 rounded-lg">
      {/* Request Types section */}
      <SkeletonBox className="h-6 w-24" />
      <div className="flex flex-wrap gap-3">
        {[1, 2, 3].map((i) => (
          <SkeletonBox key={i} className="h-10 w-24" />
        ))}
      </div>

      {/* Budget section */}
      <div className="budget flex flex-col gap-2">
        <SkeletonBox className="h-6 w-16" />
        <div className="space-y-4">
          <SkeletonBox className="h-[72px] w-full" />
          <SkeletonBox className="h-[72px] w-full" />
        </div>
      </div>

      {/* Target Audience & Valid Till section */}
      <div className="flex flex-col gap-2">
        <div className="space-y-4">
          <SkeletonBox className="h-6 w-32" />
          <SkeletonBox className="h-10 w-full" />
        </div>

        <div className="space-y-4 mt-4">
          <SkeletonBox className="h-6 w-20" />
          <SkeletonBox className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};

export default AgentRequestLoader;

const SkeletonBox = ({ className }: { className: string }) => (
  <div
    className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}
    style={{ animation: "pulse 1.5s ease-in-out infinite" }}
  />
);
