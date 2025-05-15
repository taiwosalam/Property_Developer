export const SummarySkeleton = () => {
  return (
    <div className="bg-white shadow-md dark:bg-darkText-primary p-4 rounded-lg animate-pulse">
      <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="flex gap-4 justify-between w-full items-start"
          >
            <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};
