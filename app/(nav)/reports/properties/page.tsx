"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsPropertiessFilterOptionsWithDropdown,
  propertiesReportTablefields,
} from "./data";

const PropertiesReport = () => {
  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: (index + 1).toString(),
      property: `Property ${index + 1}`,
      branch: `branch ${index + 1}`,
      account_officer: `Officer ${index + 1}`,
      landlord: `Landlord ${index + 1}`,
      date_created: `12/12/12`,
    }));
  };

  const tableData = generateTableData(10);

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
        pageTitle="Properties Report"
        aboutPageModalData={{
          title: "Properties Report",
          description:
            "This page contains a list of Properties Report on the platform.",
        }}
        searchInputPlaceholder="Search for Properties Report"
        handleFilterApply={() => {}}
        filterOptions={[]}
        filterWithOptionsWithDropdown={
          reportsPropertiessFilterOptionsWithDropdown
        }
        hasGridListToggle={false}
        exportHref="/reports/properties/export"
      />
      <CustomTable
        fields={propertiesReportTablefields}
        data={tableData}
        tableHeadClassName="h-[45px]"
      />
    </div>
  );
};

export default PropertiesReport;
