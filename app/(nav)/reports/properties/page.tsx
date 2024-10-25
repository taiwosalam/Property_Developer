"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { reportsPropertiessFilterOptionsWithDropdown } from "./data";

const PropertiesReport = () => {
  const fields: Field[] = [
    { id: "0", label: "S/N", accessor: "S/N" },
    { id: "1", label: "ID", accessor: "id" },
    {
      id: "2",
      label: "Property",
      accessor: "property",
    },
    { id: "3", label: "Branch", accessor: "branch" },
    {
      id: "5",
      label: "Account Officer",
      accessor: "account_officer",
      cellStyle: { textTransform: "uppercase" },
    },
    { id: "6", label: "landlord / landlady", accessor: "landlord" },
    { id: "7", label: "Date Created", accessor: "date_created" },
  ];

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
        <ManagementStatistcsCard title="Total" newData={23} total={200} />
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
        fields={fields}
        data={tableData}
        tableHeadClassName="h-[45px]"
      />
      <Pagination totalPages={2} currentPage={2} onPageChange={() => {}} />
    </div>
  );
};

export default PropertiesReport;
