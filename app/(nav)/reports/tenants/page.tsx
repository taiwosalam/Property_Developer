"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { reportsTenantsFilterOptionsWithDropdown } from "./data";
import useDarkMode from "@/hooks/useCheckDarkMode";

const TenantsReport = () => {
  const isDarkMode = useDarkMode();
  const fields: Field[] = [
    { id: "0", label: "S/N", accessor: "S/N" },
    { id: "1", label: "Tenant / Occupant ID", accessor: "id" },
    {
      id: "2",
      label: "Name",
      accessor: "name",
      cellStyle: { textTransform: "uppercase" },
    },
    { id: "3", label: "Gender", accessor: "gender" },
    { id: "4", label: "Contact Address", accessor: "address" },
    { id: "5", label: "Telephone", accessor: "telephone" },
    { id: "6", label: "Status", accessor: "status" },
  ];

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
        />
        <ManagementStatistcsCard
          title="Total Occupants"
          newData={23}
          total={200}
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
        fields={fields}
        data={tableData}
        tableHeadClassName="bg-brand-9 h-[45px]"
        tableHeadCellSx={{
          color: "#EFF6FF",
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

export default TenantsReport;
