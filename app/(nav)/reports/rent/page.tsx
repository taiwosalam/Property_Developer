"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsRentFilterOptionsWithDropdown,
  rentReportTableFields,
} from "./data";

const RentReport = () => {
  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      unit_id: (index + 1).toString(),
      property_name: `Property ${index + 1}`,
      tenant_name: `Tenant ${index + 1}`,
      unit_description: `unit desc ${index + 1}`,
      start_date: "12/12/12",
      end_date: "12/12/12",
      status: index % 2 === 0 ? "vacant" : "occupied",
      first_deposit: `2,600,800`,
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Rent / Due"
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
        pageTitle="Rent / Due Roll"
        aboutPageModalData={{
          title: "Rent / Due Roll",
          description:
            "This page contains a list of Rent / Due Roll on the platform.",
        }}
        searchInputPlaceholder="Search for Rent Roll"
        handleFilterApply={() => {}}
        filterOptions={[]}
        filterWithOptionsWithDropdown={reportsRentFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/rent/export"
      />
      <CustomTable
        fields={rentReportTableFields}
        data={tableData}
        tableHeadClassName="h-[45px]"
      />
      <Pagination totalPages={2} currentPage={2} onPageChange={() => {}} />
    </div>
  );
};

export default RentReport;
