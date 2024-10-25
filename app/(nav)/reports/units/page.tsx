"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { reportsUnitsFilterOptionsWithDropdown } from "./data";

const UnitsReport = () => {
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
    { id: "6", label: "status", accessor: "status" },
    { id: "7", label: "Annual Rent", accessor: "annual_rent" },
  ];

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
        <ManagementStatistcsCard title="Total Units" newData={23} total={200} />
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
        fields={fields}
        data={tableData}
        tableHeadClassName="h-[45px]"
      />
      <Pagination totalPages={2} currentPage={2} onPageChange={() => {}} />
    </div>
  );
};

export default UnitsReport;
