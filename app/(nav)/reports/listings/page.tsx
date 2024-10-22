"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { reportsListingsFilterOptionsWithDropdown } from "./data";
import useDarkMode from "@/hooks/useCheckDarkMode";

const ListingsReport = () => {
  const isDarkMode = useDarkMode();
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
        />
        <ManagementStatistcsCard title="Published" newData={23} total={200} />
        <ManagementStatistcsCard title="Unpublished" newData={23} total={200} />
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

export default ListingsReport;
