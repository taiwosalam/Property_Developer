"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
// import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import FilterButton from "@/components/FilterButton/filter-button";
import ExportButton from "@/components/reports/export-button";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";

const TenantsReport = () => {
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
      <div className="page-title-container">
        <PageTitle title="Tenants/Occupants" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search for Tenants & Occupants" />
          <FilterButton />
          <ExportButton type="pdf" />
          <ExportButton type="csv" />
        </div>
      </div>
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
      <Pagination totalPages={2} currentPage={2} onPageChange={() => {}} />
    </div>
  );
};

export default TenantsReport;
