"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { reportsRentFilterOptionsWithDropdown } from "./data";
import useDarkMode from "@/hooks/useCheckDarkMode";

const RentReport = () => {
  const isDarkMode = useDarkMode();
  const fields: Field[] = [
    { id: "0", label: "S/N", accessor: "S/N" },
    { id: "1", label: "Unit ID", accessor: "unit_id" },
    {
      id: "2",
      label: "Property Name",
      accessor: "property_name",
    },
    { id: "3", label: "Tenant / Occupant", accessor: "tenant_name" },
    {
      id: "5",
      label: "Start Date",
      accessor: "start_date",
    },
    { id: "6", label: "End Date", accessor: "end_date" },
    { id: "7", label: "Status", accessor: "status" },
    { id: "8", label: "First Deposit", accessor: "first_deposit" },
  ];

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
        fields={fields}
        data={tableData}
        tableHeadClassName="bg-brand-9 h-[45px]"
        tableHeadCellSx={{
          color: isDarkMode ? "#EFF6FF" : "#050901",
          fontWeight: 500,
          border: "none",
          textAlign: "left",
          fontSize: "14px",
        }}
        tableBodyCellSx={{
          border: "none",
          textAlign: "left",
          fontWeight: 500,
          color: isDarkMode ? "#fff" : "#050901",
          fontSize: "14px",
        }}
        evenRowColor={isDarkMode ? "#3C3D37" : "#fff"}
        oddRowColor={isDarkMode ? "#020617" : "#FAFAFA"}
      />
      <Pagination totalPages={2} currentPage={2} onPageChange={() => {}} />
    </div>
  );
};

export default RentReport;
