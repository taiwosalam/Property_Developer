"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsLandlordsFilterOptionsWithDropdown,
  landlordsReportTableFields,
  landlordsReportTableData,
  // LandlordsReport,
  LandlordsApiResponse,
  transformLandlordsData,
} from "./data";
import { type LandlordsReport } from './data';
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";

const LandlordsReport = () => {
  const [landlords_report, setLandlords_report] = useState<LandlordsReport>({
    total_landlords: 0,
    monthly_landlords: 0,
    landlords: [],
  });

  const {
    total_landlords,
    monthly_landlords,
    landlords
  } = landlords_report

  const { data, loading, error, isNetworkError } = useFetch<LandlordsApiResponse>("/report/landlords");

  useEffect(() => {
    if (data) {
      setLandlords_report(transformLandlordsData(data));
    }
  }, [data]);

  if (loading) return <CustomLoader layout="page" pageTitle="Tenants/Occupants" view="table" />
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total"
          newData={monthly_landlords}
          total={total_landlords}
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        exports
        isDateTrue
        pageTitle="Landlord/Landlady"
        aboutPageModalData={{
          title: "Landlord/Landlady",
          description:
            "This page contains a list of Landlord/Landlady on the platform.",
        }}
        searchInputPlaceholder="Search for Landlord/Landlady"
        handleFilterApply={() => { }}
        filterOptionsMenu={reportsLandlordsFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/landlord/export"
      />
      <CustomTable
        fields={landlordsReportTableFields}
        // data={landlordsReportTableData}
        data={landlords}
        tableHeadClassName="h-[45px]"
      />
    </div>
  );
};

export default LandlordsReport;
