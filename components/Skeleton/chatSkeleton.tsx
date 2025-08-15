import React from 'react'

const ChatSkeleton = () => {
    return (
        <div className="py-4 px-6 bg-neutral-2 dark:bg-black animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="flex flex-col gap-1">
              <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
  
        {/* Messages Skeleton */}
        <div className="py-5 px-6 flex-1 overflow-auto bg-white dark:bg-black custom-flex-col gap-4">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className={`flex ${index % 2 === 0 ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`py-3 px-4 rounded-2xl max-w-[70%] ${
                  index % 2 === 0
                    ? "bg-brand-primary rounded-tr-none"
                    : "bg-status-caution-1 rounded-tl-none"
                }`}
              >
                <div className="w-40 h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                <div className="w-32 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
}

export default ChatSkeleton