import React from "react";

interface SettingsEnrollmentCardSkeletonProps {
  themeColor?: string; // Optional theme color to match Free, Basic, or Premium
}

const SettingsEnrollmentCardSkeleton: React.FC<
  SettingsEnrollmentCardSkeletonProps
> = ({ themeColor = "border-gray-200" }) => {
  return (
    <div
      className={`min-w-[404px] flex flex-col justify-between pricingCard rounded-lg bg-white dark:bg-darkText-primary dark:border dark:border-[#3C3D37] overflow-hidden shadow-lg ${themeColor} animate-pulse`}
    >
      {/* PlanHeader Skeleton */}
      <div className="p-4">
        <div className="h-6 w-1/2 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      </div>

      {/* PriceSection Skeleton */}
      <div className="priceWrapper w-full flex items-center justify-center flex-col px-4 mt-5">
        <div className="flex items-baseline gap-2">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
        </div>
        <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>

        {/* BillingTypeSelector Skeleton */}
        <div className="flex gap-2 mt-4">
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
        </div>

        {/* QuantityCounter Skeleton */}
        <div className="flex items-center gap-2 mt-4">
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
          <div className="h-6 w-12 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* FeaturesToggle Skeleton */}
      <div className="px-4 py-2">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>

      {/* FeaturesList Skeleton */}
      <div className="px-4 pb-4">
        <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
      </div>

      {/* SelectPlanButton Skeleton */}
      <div className="px-2 pb-4 flex justify-end">
        <div className="h-10 w-full bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default SettingsEnrollmentCardSkeleton;
