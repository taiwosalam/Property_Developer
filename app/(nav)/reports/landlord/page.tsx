"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsLandlordsFilterOptionsWithDropdown,
  landlordsReportTableFields,
} from "./data";

const LandlordsReport = () => {
  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: (index + 1).toString(),
      name: `name ${index + 1}`,
      address: `ADDRESS ${index + 1}`,
      telephone: `TELEPHONE ${index + 1}`,
      email: `${index + 1}@email.com`,
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
        data={tableData}
        tableHeadClassName="h-[45px]"
      />
      <Pagination totalPages={2} currentPage={2} onPageChange={() => {}} />
    </div>
  );
};

export default LandlordsReport;
