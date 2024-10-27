"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsLandlordsFilterOptionsWithDropdown,
  landlordsReportTableFields,
  landlordsReportTableData,
} from "./data";

const LandlordsReport = () => {
  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total"
          newData={23}
          total={200}
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        exports
        isDateTrue
        onStateSelect={() => {}}
        pageTitle="Landlord/Landlady"
        aboutPageModalData={{
          title: "Landlord/Landlady",
          description:
            "This page contains a list of Landlord/Landlady on the platform.",
        }}
        searchInputPlaceholder="Search for Landlord/Landlady"
        handleFilterApply={() => {}}
        filterOptions={[]}
        filterWithOptionsWithDropdown={
          reportsLandlordsFilterOptionsWithDropdown
        }
        hasGridListToggle={false}
        exportHref="/reports/landlord/export"
      />
      <CustomTable
        fields={landlordsReportTableFields}
        data={landlordsReportTableData}
        tableHeadClassName="h-[45px]"
      />
    </div>
  );
};

export default LandlordsReport;
