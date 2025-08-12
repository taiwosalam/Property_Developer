import React from "react";

const NotificationsSkeleton = () => {
  return (
    <div className="max-w-full p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
      </div>

      {/* Notification Items */}
      <div className="space-y-4">
        {/* Notification 1 - New Complaint */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-start p-4 space-x-4">
            {/* Icon placeholder */}
            <div className="w-12 h-12 bg-blue-200 rounded-lg animate-pulse flex-shrink-0"></div>

            <div className="flex-1">
              {/* Title and time */}
              <div className="flex justify-between items-start mb-2">
                <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>

              {/* Notification content */}
              <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-56 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification 2 - Application Submitted */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-start p-4 space-x-4">
            {/* Icon placeholder */}
            <div className="w-12 h-12 bg-blue-200 rounded-lg animate-pulse flex-shrink-0"></div>

            <div className="flex-1">
              {/* Title and time */}
              <div className="flex justify-between items-start mb-2">
                <div className="h-5 bg-gray-200 rounded w-56 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>

              {/* Notification content */}
              <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-36 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification 3 - New Inspection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-start p-4 space-x-4">
            {/* Icon placeholder */}
            <div className="w-12 h-12 bg-gray-800 rounded-lg animate-pulse flex-shrink-0"></div>

            <div className="flex-1">
              {/* Title and time */}
              <div className="flex justify-between items-start mb-2">
                <div className="h-5 bg-gray-200 rounded w-44 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-18 animate-pulse"></div>
              </div>

              {/* Notification content */}
              <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification 4 - Another Application */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-start p-4 space-x-4">
            {/* Icon placeholder */}
            <div className="w-12 h-12 bg-blue-200 rounded-lg animate-pulse flex-shrink-0"></div>

            <div className="flex-1">
              {/* Title and time */}
              <div className="flex justify-between items-start mb-2">
                <div className="h-5 bg-gray-200 rounded w-56 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>

              {/* Notification content */}
              <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-36 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSkeleton;
