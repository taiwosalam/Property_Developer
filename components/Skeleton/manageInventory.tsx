import React from "react";

export const ManageInventorySkeleton = () => {
  return (
    <div className="custom-flex-col gap-10 min-h-[80vh] pb-[150px] lg:pb-[100px] animate-pulse">
      <div className="flex flex-col gap-4">
        <div className="h-8 w-1/2 bg-gray-300 rounded"></div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 h-10 bg-gray-300 rounded"></div>
          <div className="flex-1 h-10 bg-gray-300 rounded"></div>
          <div className="flex-1 h-10 bg-gray-300 rounded"></div>
        </div>
        <div className="px-6 py-12 bg-gray-300 rounded-lg custom-flex-col gap-4">
          <p className="h-8 w-1/4 bg-gray-300 rounded"></p>
          <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:items-center">
            <div className="h-6 w-full bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {[...Array(2)].map(
          (_, index) => (
            <div key={index} className="h-48 bg-gray-300 rounded"></div>
          )
        )}
      </div>
    </div>
  );
};