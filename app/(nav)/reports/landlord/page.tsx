"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { reportsLandlordsFilterOptionsWithDropdown } from "./data";

const LandlordsReport = () => {
  const fields: Field[] = [
    { id: "0", label: "S/N", accessor: "S/N" },
    { id: "1", label: "Landlord / Landlady ID", accessor: "id" },
    {
      id: "2",
      label: "Name",
      accessor: "name",
      cellStyle: { textTransform: "uppercase" },
    },
    { id: "3", label: "Contact Address", accessor: "address" },
    { id: "5", label: "Telephone", accessor: "telephone" },
    { id: "6", label: "email", accessor: "email" },
  ];

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
        <ManagementStatistcsCard title="Total" newData={23} total={200} />
      </div>
      <FilterBar azFilter exports isDateTrue onStateSelect={() => { }} pageTitle="Landlord/Landlady" aboutPageModalData={
        { title: "Landlord/Landlady", description: "This page contains a list of Landlord/Landlady on the platform." }
      } searchInputPlaceholder="Search for Landlord/Landlady" handleFilterApply={() => { }} filterOptions={[]} filterWithOptionsWithDropdown={reportsLandlordsFilterOptionsWithDropdown} />
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
          color: "#050901",
          fontSize: "14px",
        }}
        evenRowColor="#fff"
        oddRowColor="#FAFAFA"
      />
      <Pagination totalPages={2} currentPage={2} onPageChange={() => { }} />
    </div>
  );
};

export default LandlordsReport;
