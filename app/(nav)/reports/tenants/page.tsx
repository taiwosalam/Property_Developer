"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsTenantsFilterOptionsWithDropdown,
  tenantsReportTableFields,
} from "./data";

const TenantsReport = () => {
  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: (index + 1).toString(),
      name: `name ${index + 1}`,
      gender: index % 2 === 0 ? "Male" : "Female",
      address: `ADDRESS ${index + 1}`,
      telephone: `TELEPHONE ${index + 1}`,
      status: `STATUS ${index + 1}`,
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Tenants"
          newData={23}
          total={200}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Total Occupants"
          newData={23}
          total={200}
          colorScheme={2}
        />
      </div>
      <FilterBar
        azFilter
        exports
        isDateTrue
        onStateSelect={() => {}}
        pageTitle="Tenants/Occupants"
        aboutPageModalData={{
          title: "Tenants/Occupants",
          description:
            "This page contains a list of Tenants/Occupants on the platform.",
        }}
        searchInputPlaceholder="Search for Tenants/Occupants"
        handleFilterApply={() => {}}
        filterOptions={[]}
        filterWithOptionsWithDropdown={reportsTenantsFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/tenants/export"
      />
      <CustomTable
        fields={tenantsReportTableFields}
        data={tableData}
        tableHeadClassName="h-[45px]"
      />
    </div>
  );
};

export default TenantsReport;
