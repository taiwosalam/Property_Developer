"use client";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsListingsFilterOptionsWithDropdown,
  trackingTableFields,
} from "./data";

const TrackingReport = () => {
  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      username: `User ${index + 1}`,
      page_visited: `Landlord Page ${index + 1}`,
      action_taken: `Login successful ${index + 1}`,
      ip_address: `IP ${index + 1}`,
      location: `Location ${index + 1}`,
      date: "12/12/12",
      time: "3:20pm",
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9">
      <FilterBar
        azFilter
        exports
        isDateTrue
        onStateSelect={() => {}}
        pageTitle="Tracking"
        aboutPageModalData={{
          title: "Tracking",
          description: "This page contains a list of Tracking on the platform.",
        }}
        searchInputPlaceholder="Search for audit trail"
        handleFilterApply={() => {}}
        filterOptions={[]}
        filterWithOptionsWithDropdown={reportsListingsFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/tracking/export"
      />
      <CustomTable
        fields={trackingTableFields}
        data={tableData}
        tableHeadClassName="h-[45px]"
      />
    </div>
  );
};

export default TrackingReport;
