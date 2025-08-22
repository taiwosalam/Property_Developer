
import React from 'react';

export const ReviewCardSkeleton = ({ count = 6 }) => {
  return (
    <div className="space-y-4 p-4 bg-white dark:bg-black/50">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg animate-pulse">
          {/* Avatar skeleton */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Content skeleton */}
          <div className="flex-1 space-y-2">
            {/* Name and badge skeleton */}
            <div className="flex items-center space-x-2">
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
            </div>
            
            {/* Review text skeleton */}
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
