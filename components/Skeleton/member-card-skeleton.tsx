export function TeamChatMemberSkeleton({ count = 3 }) {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="flex items-center gap-4 mt-2 animate-pulse">
          <div className="flex justify-center items-center gap-2">
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="h-2 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-2 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </>
  );
}

export const TeamMessageCardSkeleton = ({ count = 3 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="flex items-center gap-4 mt-4 animate-pulse">
          <div className="h-14 w-14 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="flex flex-col space-y-2">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-36 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export const TeamChatHeaderSkeleton = () => {
  return (
    <>
      <div className="flex items-center gap-4 animate-pulse">
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="h-3 w-36 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </>
  );
};

export const AboutTeamModal = () => {
  return (
    <>
      <div className="flex flex-col items-start gap-4 mt-4 animate-pulse">
        <div className="h-16 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="flex flex-col space-y-2">
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-36 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-36 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-36 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </>
  );
};
