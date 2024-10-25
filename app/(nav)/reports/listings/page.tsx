"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { reportsListingsFilterOptionsWithDropdown } from "./data";

const ListingsReport = () => {
  const fields: Field[] = [
    { id: "0", label: "S/N", accessor: "S/N" },
    { id: "1", label: "Unit ID", accessor: "unit_id" },
    {
      id: "2",
      label: "Property Name",
      accessor: "property_name",
    },
    { id: "3", label: "Unit Name", accessor: "unit_name" },
    {
      id: "5",
      label: "Unit Description",
      accessor: "unit_description",
    },
    { id: "6", label: "Status", accessor: "status" },
    { id: "7", label: "Rent Price", accessor: "rent_price" },
  ];

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
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Listings"
          newData={23}
          total={200}
          colorScheme={1}
        />
        <ManagementStatistcsCard title="Published" newData={23} total={200} />
        <ManagementStatistcsCard
          title="Unpublished"
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
        pageTitle="Listings"
        aboutPageModalData={{
          title: "Listings",
          description: "This page contains a list of Listings on the platform.",
        }}
        searchInputPlaceholder="Search for Listings"
        handleFilterApply={() => {}}
        filterOptions={[]}
        filterWithOptionsWithDropdown={reportsListingsFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/listings/export"
      />
      <CustomTable
        fields={fields}
        data={tableData}
        tableHeadClassName="h-[45px]"
      />
      <Pagination totalPages={2} currentPage={2} onPageChange={() => {}} />
    </div>
  );
};

export default ListingsReport;
