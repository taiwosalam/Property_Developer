"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsListingsFilterOptionsWithDropdown,
  listingsReportTableFields,
} from "./data";

const ListingsReport = () => {
  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      unit_id: (index + 1).toString(),
      property_name: `Property ${index + 1}`,
      unit_name: `unit ${index + 1}`,
      unit_description: `unit desc ${index + 1}`,
      status: index % 2 === 0 ? "vacant" : "occupied",
      rent_price: `2,600,800`,
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9">
      <div className="flex gap-5 overflow-x-auto hide-scrollbar md:flex-wrap">
      <ManagementStatistcsCard
          title="Total Listings"
          newData={23}
          total={200}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Published"
          newData={23}
          total={200}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Unpublished"
          newData={23}
          total={200}
          colorScheme={3}
        />
      </div>
      <FilterBar
        azFilter
        exports
        isDateTrue
        pageTitle="Listings"
        aboutPageModalData={{
          title: "Listings",
          description: "This page contains a list of Listings on the platform.",
        }}
        searchInputPlaceholder="Search for Listings"
        handleFilterApply={() => {}}
        filterOptionsMenu={reportsListingsFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/listings/export"
      />
      <CustomTable
        fields={listingsReportTableFields}
        data={tableData}
        tableHeadClassName="h-[45px]"
      />
    </div>
  );
};

export default ListingsReport;
