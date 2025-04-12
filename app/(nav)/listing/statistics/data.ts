import { ChartConfig } from "@/components/ui/chart";
import { ListingStatisticResponse } from "./type";

export const listingsStatisticsChartConfig: ChartConfig = {
  views: {
    label: "Views",
    color: "#01BA4C",
  },
  bookmarks: {
    label: "Bookmarked",
    color: "#2DD4BF",
  },
} satisfies ChartConfig;

export const listingsStatisticsChartData = [
  { date: "2024-09-01", views: 70, enquiries: 30 },
  { date: "2024-09-02", views: 100, enquiries: 60 },
  { date: "2024-09-03", views: 40, enquiries: 20 },
  { date: "2024-09-08", views: 120, enquiries: 80 },
  { date: "2024-08-18", views: 70, enquiries: 50 },
  { date: "2024-08-20", views: 150, enquiries: 90 },
  { date: "2024-08-28", views: 100, enquiries: 60 },
  { date: "2024-09-30", views: 140, enquiries: 100 },
];

export type ListingStatisticPageData = {
  total_view: number;
  total_month_views: number;
  total_bookmarks: number;
  total_month_bookmarks: number;
};

export const transformListingStatisticData = (
  data: ListingStatisticResponse
) => {
  return {
    total_view: data?.total_views ?? 0,
  };
};
