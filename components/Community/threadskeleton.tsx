const ThreadSkeleton = () => {
  return (
    <div className="bg-white dark:bg-darkText-primary rounded-lg p-4 shadow-md animate-pulse flex-1 min-w-[300px] max-w-[400px] flex-row">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="flex flex-col gap-2">
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      {/* Body Skeleton */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
      </div>

      {/* Footer Skeleton */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-4">
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
};


export default ThreadSkeleton