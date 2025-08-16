"use client";

import { useEffect, useState } from "react";

// Types
import type { StatisticsDataTypes } from "@/components/Listing/Statistics/types";

// Images
import { ChevronLeft, EmptyStatisticIcon } from "@/public/icons/icons";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Imports
import BackButton from "@/components/BackButton/back-button";
import {
  statistics_data_types,
  statisticsHeaderCard,
} from "@/components/Listing/Statistics/data";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import StatisticsMessageCard from "@/components/Listing/Statistics/statistics-message-card";
import { DashboardChart } from "@/components/dashboard/chart";
import { listingsStatisticsChartConfig } from "@/app/(nav)/listing/statistics/data";
import useFetch from "@/hooks/useFetch";
import { ListingStatisticResponse } from "@/app/(nav)/listing/statistics/type";
import DashboardLoading from "@/components/Loader/DashboardLoading";
import SearchError from "@/components/SearchNotFound/SearchNotFound";

import { useParams } from "next/navigation";

const UnitStatisticDetails = ({ id }: { id: string }) => {
  const [activeStatIndex, setActiveStatIndex] = useState(0);
  const [statsType, setStatsType] = useState<StatisticsDataTypes>("views");
  const [pageData, setPageData] = useState<ListingStatisticResponse | null>(
    null
  );

  const params = useParams();

  const {
    data: apiData,
    loading,
    error,
  } = useFetch<ListingStatisticResponse>(`unit/statistic/${params?.id}`);

  useEffect(() => {
    if (apiData) {
      setPageData(apiData);
    }
  }, [apiData]);

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

  const activeUsers =
    statistics_data_types[activeStatIndex] === "views"
      ? apiData?.view_users || []
      : apiData?.bookmark_users || [];

  const chartData =
    apiData?.chart_data.map((item) => ({
      date: item.date,
      views: item.total_views,
      bookmarks: item.total_bookmarks,
    })) || [];

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="custom-flex-col gap-10">
      <div className="custom-flex-col gap-5">
        <BackButton bold>Statistics</BackButton>
        {/* <div className="hidden md:flex gap-5 flex-wrap"> */}
        <div className="flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Views"
            newData={pageData?.total_month_views ?? 0}
            total={pageData?.total_views ?? 0}
            className="w-[240px]"
            colorScheme={1}
          />

          <ManagementStatistcsCard
            title="Web Viewers"
            newData={pageData?.total_web_month_views ?? 0}
            total={pageData?.total_web_views ?? 0}
            className="w-[240px]"
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Mobile Viewers"
            newData={pageData?.total_mobile_month_views ?? 0}
            total={pageData?.total_mobile_views ?? 0}
            className="w-[240px]"
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Bookmarked"
            newData={pageData?.total_month_bookmarks ?? 0}
            total={pageData?.total_bookmarks ?? 0}
            className="w-[240px]"
            colorScheme={2}
          />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row gap-10">
        <div className="flex-1">
          <DashboardChart
            visibleRange
            chartTitle="Performance"
            chartConfig={listingsStatisticsChartConfig}
            chartData={chartData}
          />
        </div>
        <div className="w-full xl:w-[334px]">
          <div className="w-full py-6 px-3 custom-flex-col gap-6 bg-white dark:bg-darkText-primary">
            <div className="p-2 flex justify-between">
              <h2 className="text-text-label dark:text-white text-sm font-medium">
                {statisticsHeaderCard[activeStatIndex]}
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
            <div className="custom-flex-col gap-5 max-h-[290px] overflow-y-scroll custom-round-scrollbar pr-4">
              {activeUsers.length > 0 ? (
                activeUsers.map((user) => (
                  <StatisticsMessageCard
                    key={user.id}
                    type={statistics_data_types[activeStatIndex]}
                    user={user}
                  />
                ))
              ) : (
                <div className="flex justify-center items-center min-h-[290px]">
                  <div className="flex flex-col justify-center items-center gap-4 text-brand-9 mb-10">
                    <EmptyStatisticIcon />
                    <p className="text-center text-sm text-brand-9">
                      No potential clients have bookmarked your properties yet.
                      Once they do, you&apos;ll see them here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitStatisticDetails;
