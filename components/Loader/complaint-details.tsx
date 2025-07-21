import React from "react";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  MoreVertical,
} from "lucide-react";

const ComplaintSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 no-scrollbar">
      <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-36 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="flex gap-6 p-6">
          {/* Left Section */}
          <div className="flex-1">
            {/* Complaint Details Grid */}
            <div className="grid grid-cols-4 gap-x-8 gap-y-14 mb-8">
              {/* First Row */}
              <div>
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div>
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Second Row */}
              <div>
                <div className="w-28 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="w-36 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Third Row */}
              <div>
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="w-28 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="w-40 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Fourth Row - Property Address (spans 2 columns) */}
              <div className="col-span-2">
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="w-80 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="w-full h-px bg-gray-200 mb-8"></div>

            {/* Create Reminders Section */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div className="w-36 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                  (day, index) => (
                    <div key={index} className="text-center">
                      <div className="w-8 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
                    </div>
                  )
                )}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, index) => (
                  <div
                    key={index}
                    className="h-12 flex items-center justify-center"
                  >
                    {index === 20 ? (
                      <div className="w-8 h-8 bg-gray-200 border-2 border-red-300 rounded animate-pulse"></div>
                    ) : index === 23 ? (
                      <div className="w-8 h-8 bg-purple-200 rounded animate-pulse"></div>
                    ) : (
                      <div className="w-6 h-4 bg-gray-200 rounded animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-[500px]">
            {/* Attached Images Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Property Image */}
              <div className="grid grid-cols-2 gap-4">
                  <div className="w-full h-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="w-full h-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="w-full h-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="w-full h-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              </div>
            
            </div>

            {/* Assign Task Section */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-center mb-4">
                <div className="w-24 h-5 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
                <div className="w-48 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
              </div>

              {/* Task Assignment Options */}
              <div className="space-y-3">
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Proceed Button */}
              <div className="w-full h-12 bg-gray-200 rounded animate-pulse mt-6"></div>
            </div>

            {/* Messages from Task Section */}
            <div className="bg-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="text-center">
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintSkeleton;
