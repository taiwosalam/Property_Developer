import React from "react";
import { ChevronLeft, Heart, MessageCircle, Send } from "lucide-react";

const AnnouncementSkeleton = () => {
  return (
    <div className="w-full min-h-screen h-full bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-40 h-9 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="flex gap-6 p-6">
          {/* Left Section */}
          <div className="flex-1">
            {/* Announcement text */}
            <div className="w-full h-[400px] bg-gray-200 rounded animate-pulse mb-10"></div>

            {/* Actions (like/dislike) */}
            <div className="flex items-center justify-end gap-6 mb-10">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-3 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-3 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Comment prompt */}
            <div className="w-40 h-4 bg-gray-200 rounded animate-pulse mb-4"></div>

            {/* Comment input */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* No comments text */}
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Right Section */}
          <div className="w-[500px] ml-10">
            {/* Attached Images Section */}
            <div className="mb-8 grid grid-cols-2 gap-4">
              {/* Second row of images */}
              <div className="w-60 h-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-60 h-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-60 h-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-60 h-24 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Target Audience Section */}
            <div className="mb-10 mt-6">
              <div className="w-full h-5 bg-gray-200 rounded animate-pulse mb-6"></div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Read By Section */}
        <div className="bg-gray-50 p-6 max-w-[500px] ml-auto">
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-36 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementSkeleton;
