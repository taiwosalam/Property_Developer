"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Types
import type { StatisticsDataTypes } from "@/components/Listing/Statistics/types";

// Images
import { ChevronLeft } from "@/public/icons/icons";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Imports
import { statistics_data_types } from "@/components/Listing/Statistics/data";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import StatisticsMessageCard from "@/components/Listing/Statistics/statistics-message-card";
import { DashboardChart } from "@/components/dashboard/chart";

const Statistics = () => {
  const router = useRouter();

  const [activeStatIndex, setActiveStatIndex] = useState(0);
  const [statsType, setStatsType] = useState<StatisticsDataTypes>("enquires");

  // Function to handle next button click
  const handleNext = () => {
    setActiveStatIndex((prevIndex) =>
      prevIndex === statistics_data_types.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to handle previous button click
  const handlePrev = () => {
    setActiveStatIndex((prevIndex) =>
      prevIndex === 0 ? statistics_data_types.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="custom-flex-col gap-10">
      <div className="custom-flex-col gap-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="back"
            onClick={() => router.back()}
            className="p-1"
          >
            <ChevronLeft />
          </button>
          <p className="text-black font-bold text-lg lg:text-xl">Statistics</p>
        </div>
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Enquires"
            newData={34}
            total={657}
            className="w-[240px]"
          />
          <ManagementStatistcsCard
            title="Views"
            newData={34}
            total={657}
            className="w-[240px]"
          />
          <ManagementStatistcsCard
            title="Offers"
            newData={34}
            total={657}
            className="w-[240px]"
          />
          <ManagementStatistcsCard
            title="Bookmarked"
            newData={34}
            total={657}
            className="w-[240px]"
          />
        </div>
      </div>
      <div className="flex gap-10">
        <div className="flex-1">
          <DashboardChart visibleRange chartTitle="Performance" />
        </div>
        <div className="w-[334px]">
          <div className="w-full py-6 px-3 custom-flex-col gap-6 bg-white">
            <div className="p-2 flex justify-between">
              <h2 className="text-text-label text-sm font-medium capitalize">
                {statistics_data_types[activeStatIndex]}
              </h2>
              <div className="flex gap-3">
                <button onClick={handlePrev}>
                  <ArrowLeft size={18} color="#696B70" />
                </button>
                <button onClick={handleNext}>
                  <ArrowRight size={18} color="#696B70" />
                </button>
              </div>
            </div>
            <div className="custom-flex-col gap-5">
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <StatisticsMessageCard
                    key={index}
                    type={statistics_data_types[activeStatIndex]}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
