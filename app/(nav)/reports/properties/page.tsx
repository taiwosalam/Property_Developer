"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsPropertiessFilterOptions,
  propertiesReportTablefields,
  TransformedPropertyData,
  PropertyApiResponse,
  transformPropertyData,
} from "./data";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";

const PropertiesReport = () => {
  const [pageData, setPageData] = useState<TransformedPropertyData>({
    total_properties: 0,
    monthly_properties: 0,
    properties: [],
  });

  const { data, loading, error, isNetworkError } = useFetch<PropertyApiResponse>("/report/properties");

  useEffect(() => {
    if (data) {
      const transformedData = transformPropertyData(data);
      setPageData(transformedData);
    }
  }, [data]);

  const {
    total_properties,
    monthly_properties,
    properties,
  } = pageData

  if (loading) return <CustomLoader layout="page" pageTitle="Properties Report" view="table" />
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total"
          newData={monthly_properties}
          total={total_properties}
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        exports
        isDateTrue
        pageTitle="Properties Report"
        aboutPageModalData={{
          title: "Properties Report",
          description:
            "This page contains a list of Properties Report on the platform.",
        }}
        searchInputPlaceholder="Search for Properties Report"
        handleFilterApply={() => { }}
        filterOptionsMenu={reportsPropertiessFilterOptions}
        hasGridListToggle={false}
        exportHref="/reports/properties/export"
      />
      <CustomTable
        fields={propertiesReportTablefields}
        data={properties}
        tableHeadClassName="h-[45px]"
      />
    </div>
  );
};

export default PropertiesReport;
