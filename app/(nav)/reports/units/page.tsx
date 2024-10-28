"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsUnitsFilterOptionsWithDropdown,
  unitsReportTableFields,
} from "./data";

const UnitsReport = () => {
  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      unit_id: (index + 1).toString(),
      property_name: `Property ${index + 1}`,
      unit_name: `unit ${index + 1}`,
      unit_description: `unit desc ${index + 1}`,
      status: index % 2 === 0 ? "vacant" : "occupied",
      annual_rent: `2,600,800`,
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Units"
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
        pageTitle="Units"
        aboutPageModalData={{
          title: "Units",
          description: "This page contains a list of Units on the platform.",
        }}
        searchInputPlaceholder="Search for Units"
        handleFilterApply={() => {}}
        filterOptions={[]}
        filterWithOptionsWithDropdown={reportsUnitsFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/units/export"
      />
      <CustomTable
        fields={unitsReportTableFields}
        data={tableData}
        tableHeadClassName="h-[45px]"
      />
    </div>
  );
};

export default UnitsReport;
